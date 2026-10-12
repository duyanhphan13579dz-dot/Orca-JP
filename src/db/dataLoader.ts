import { dbInstance } from './indexdb';
import { DatabaseSyncStatus, KanjiItem, GrammarItem, KanaItem, ReadingItem, JLPTLevel } from '../types';

// Fallback static imports in case fetch/worker is restricted (e.g., file:// protocol or offline launch)
import { HIRAGANA_DATA, KATAKANA_DATA, DAKUON_DATA, YOON_DATA } from '../data/kanaData';
import { N5_KANJI } from '../data/n5/kanji';
import { N4_KANJI } from '../data/n4/kanji';
import { N3_KANJI } from '../data/n3/kanji';
import { N5_GRAMMAR } from '../data/n5/grammar';
import { N4_GRAMMAR } from '../data/n4/grammar';
import { N3_GRAMMAR } from '../data/n3/grammar';
import { N5_VOCAB_SRS } from '../data/n5/vocab';
import { N4_VOCAB_SRS } from '../data/n4/vocab';
import { N3_VOCAB_SRS } from '../data/n3/vocab';
import { DOKKAI_READINGS } from '../data/n3/readings';

export const CURRENT_DATA_VERSION = '2.0.0';

export const CHUNK_FILES = [
  'kana.json',
  'n5_kanji.json',
  'n4_kanji.json',
  'n3_kanji.json',
  'n5_grammar.json',
  'n4_grammar.json',
  'n3_grammar.json',
  'n5_vocab.json',
  'n4_vocab.json',
  'n3_vocab.json',
  'n3_readings.json',
  'phonetic_rules.json',
  'nuance_pairs.json',
];

export const CHUNK_STORE_MAP: Record<string, string> = {
  'kana.json': 'kana',
  'n5_kanji.json': 'kanji',
  'n4_kanji.json': 'kanji',
  'n3_kanji.json': 'kanji',
  'n5_grammar.json': 'grammar',
  'n4_grammar.json': 'grammar',
  'n3_grammar.json': 'grammar',
  'n5_vocab.json': 'vocab',
  'n4_vocab.json': 'vocab',
  'n3_vocab.json': 'vocab',
  'n3_readings.json': 'readings',
};

type SyncListener = (status: DatabaseSyncStatus) => void;

class DataLoader {
  private status: DatabaseSyncStatus = {
    status: 'idle',
    loadedChunks: [],
    progress: 0,
    totalItems: 0,
  };
  private listeners: Set<SyncListener> = new Set();
  private initPromise: Promise<boolean> | null = null;

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  private updateStatus(patch: Partial<DatabaseSyncStatus>) {
    this.status = { ...this.status, ...patch };
    for (const listener of this.listeners) {
      listener(this.status);
    }
  }

  public getStatus(): DatabaseSyncStatus {
    return this.status;
  }

  public async initialize(): Promise<boolean> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.updateStatus({ status: 'loading', progress: 5 });

        // 1. Check if DB is already synced with current version
        const syncedVersion = await dbInstance.getMeta<string>('data_version');
        const kanjiCount = (await dbInstance.getAllKanji()).length;

        if (syncedVersion === CURRENT_DATA_VERSION && kanjiCount > 0) {
          this.updateStatus({
            status: 'ready',
            progress: 100,
            loadedChunks: CHUNK_FILES,
            totalItems: kanjiCount,
            lastUpdated: new Date().toISOString(),
          });
          return true;
        }

        // 2. Attempt Web Worker background loading first
        let loadedViaWorker = false;
        try {
          if (typeof Worker !== 'undefined') {
            loadedViaWorker = await this.loadWithWorker();
          }
        } catch (workerErr) {
          console.warn('[DataLoader] Worker load failed or unsupported, using direct fallback:', workerErr);
        }

        // 3. Fallback to direct static seed if worker did not complete
        if (!loadedViaWorker) {
          await this.loadWithDirectFallback();
        }

        // 4. Mark DB as synced in metadata
        await dbInstance.setMeta('data_version', CURRENT_DATA_VERSION);
        await dbInstance.setMeta('synced_at', new Date().toISOString());

        // 5. Ensure SRS default deck is seeded if empty
        const currentCards = await dbInstance.getAllCards();
        if (currentCards.length === 0) {
          const initialSrs = [...N5_VOCAB_SRS, ...N4_VOCAB_SRS, ...N3_VOCAB_SRS];
          await dbInstance.bulkSaveCards(initialSrs);
        }

        const finalKanji = await dbInstance.getAllKanji();
        this.updateStatus({
          status: 'ready',
          progress: 100,
          loadedChunks: CHUNK_FILES,
          totalItems: finalKanji.length,
          lastUpdated: new Date().toISOString(),
        });
        return true;
      } catch (err) {
        console.error('[DataLoader] Initialization error:', err);
        this.updateStatus({ status: 'error', progress: 0 });
        return false;
      }
    })();

    return this.initPromise;
  }

  private async loadWithWorker(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const worker = new Worker(
          new URL('../workers/dataLoader.worker.ts', import.meta.url),
          { type: 'module' }
        );

        worker.onmessage = async (e: MessageEvent) => {
          const data = e.data;
          if (data.type === 'PROGRESS') {
            this.updateStatus({
              progress: Math.min(95, Math.round(data.percent * 0.8)),
              loadedChunks: [...this.status.loadedChunks, data.chunk],
            });
          } else if (data.type === 'COMPLETE') {
            // Save payload to IndexedDB
            const chunksData = data.data as Record<string, unknown[]>;
            for (const [filename, items] of Object.entries(chunksData)) {
              const storeName = CHUNK_STORE_MAP[filename];
              if (storeName && Array.isArray(items)) {
                await dbInstance.bulkSaveChunk(storeName, items as { id: string }[]);
              }
            }
            worker.terminate();
            resolve(true);
          } else if (data.type === 'ERROR') {
            worker.terminate();
            resolve(false);
          }
        };

        worker.onerror = () => {
          worker.terminate();
          resolve(false);
        };

        worker.postMessage({
          type: 'LOAD_CHUNKS',
          baseUrl: window.location.origin,
          chunks: CHUNK_FILES,
        });
      } catch {
        resolve(false);
      }
    });
  }

  private async loadWithDirectFallback(): Promise<void> {
    this.updateStatus({ progress: 20 });
    const allKana = [...HIRAGANA_DATA, ...KATAKANA_DATA, ...DAKUON_DATA, ...YOON_DATA];
    await dbInstance.bulkSaveChunk('kana', allKana);

    this.updateStatus({ progress: 40 });
    await dbInstance.bulkSaveChunk('kanji', N5_KANJI);
    await dbInstance.bulkSaveChunk('kanji', N4_KANJI);
    await dbInstance.bulkSaveChunk('kanji', N3_KANJI);

    this.updateStatus({ progress: 60 });
    await dbInstance.bulkSaveChunk('grammar', N5_GRAMMAR);
    await dbInstance.bulkSaveChunk('grammar', N4_GRAMMAR);
    await dbInstance.bulkSaveChunk('grammar', N3_GRAMMAR);

    this.updateStatus({ progress: 80 });
    await dbInstance.bulkSaveChunk('vocab', N5_VOCAB_SRS);
    await dbInstance.bulkSaveChunk('vocab', N4_VOCAB_SRS);
    await dbInstance.bulkSaveChunk('vocab', N3_VOCAB_SRS);

    this.updateStatus({ progress: 95 });
    await dbInstance.bulkSaveChunk('readings', DOKKAI_READINGS);
  }

  // Fast query API from IndexedDB with level awareness
  public async getKanji(level: JLPTLevel): Promise<KanjiItem[]> {
    const list = await dbInstance.getKanjiByLevel(level);
    if (list.length > 0) return list;
    if (level === 'N5') return N5_KANJI;
    if (level === 'N4') return N4_KANJI;
    if (level === 'N3') return N3_KANJI;
    return N5_KANJI;
  }

  public async getGrammar(level: JLPTLevel): Promise<GrammarItem[]> {
    const list = await dbInstance.getGrammarByLevel(level);
    if (list.length > 0) return list;
    if (level === 'N5') return N5_GRAMMAR;
    if (level === 'N4') return N4_GRAMMAR;
    if (level === 'N3') return N3_GRAMMAR;
    return N5_GRAMMAR;
  }

  public async getReadings(level: 'N4' | 'N3'): Promise<ReadingItem[]> {
    const list = await dbInstance.getReadingsByLevel(level);
    if (list.length > 0) return list;
    return DOKKAI_READINGS.filter((r) => r.level === level);
  }

  public async getKana(): Promise<KanaItem[]> {
    const list = await dbInstance.getAllKana();
    if (list.length > 0) return list;
    return [...HIRAGANA_DATA, ...KATAKANA_DATA, ...DAKUON_DATA, ...YOON_DATA];
  }
}

export const dataLoader = new DataLoader();
