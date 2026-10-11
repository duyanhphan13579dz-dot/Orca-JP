import {
  SRSCard,
  UserStats,
  KanjiItem,
  GrammarItem,
  ReadingItem,
  KanaItem,
  JLPTLevel,
  HistoryRecord,
  DailyStreakRecord,
  BookmarkRecord,
  CustomTag,
} from '../types';

export const DB_NAME = 'OrcaJP_Database';
export const DB_VERSION = 2;

export class OrcaIndexedDB {
  private dbPromise: Promise<IDBDatabase> | null = null;

  public openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. SRS Cards Store
        if (!db.objectStoreNames.contains('srs_cards')) {
          const srsStore = db.createObjectStore('srs_cards', { keyPath: 'id' });
          srsStore.createIndex('level', 'level', { unique: false });
          srsStore.createIndex('dueDate', 'dueDate', { unique: false });
          srsStore.createIndex('status', 'status', { unique: false });
          srsStore.createIndex('type', 'type', { unique: false });
        }

        // 2. User Stats Store
        if (!db.objectStoreNames.contains('user_stats')) {
          db.createObjectStore('user_stats', { keyPath: 'key' });
        }

        // 3. Legacy & Basic Bookmarks Store
        if (!db.objectStoreNames.contains('bookmarks')) {
          db.createObjectStore('bookmarks', { keyPath: 'id' });
        }

        // 4. Enhanced Bookmarked Items Store
        if (!db.objectStoreNames.contains('bookmarked_items')) {
          const bmStore = db.createObjectStore('bookmarked_items', { keyPath: 'id' });
          bmStore.createIndex('itemType', 'itemType', { unique: false });
          bmStore.createIndex('level', 'level', { unique: false });
          bmStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 5. Custom Tags Store
        if (!db.objectStoreNames.contains('custom_tags')) {
          db.createObjectStore('custom_tags', { keyPath: 'id' });
        }

        // 6. User History Store (Quizzes, Games, Reviews)
        if (!db.objectStoreNames.contains('user_history')) {
          const histStore = db.createObjectStore('user_history', { keyPath: 'id' });
          histStore.createIndex('timestamp', 'timestamp', { unique: false });
          histStore.createIndex('type', 'type', { unique: false });
          histStore.createIndex('itemId', 'itemId', { unique: false });
        }

        // 7. Daily Activity & Streaks Store
        if (!db.objectStoreNames.contains('study_streaks')) {
          const streakStore = db.createObjectStore('study_streaks', { keyPath: 'date' });
          streakStore.createIndex('date', 'date', { unique: true });
        }

        // 8. Content Store: Kanji
        if (!db.objectStoreNames.contains('kanji')) {
          const kanjiStore = db.createObjectStore('kanji', { keyPath: 'id' });
          kanjiStore.createIndex('level', 'level', { unique: false });
          kanjiStore.createIndex('kanji', 'kanji', { unique: false });
          kanjiStore.createIndex('hanViet', 'hanViet', { unique: false });
          kanjiStore.createIndex('strokes', 'strokes', { unique: false });
          kanjiStore.createIndex('level_id', ['level', 'id'], { unique: false });
        }

        // 9. Content Store: Grammar
        if (!db.objectStoreNames.contains('grammar')) {
          const grammarStore = db.createObjectStore('grammar', { keyPath: 'id' });
          grammarStore.createIndex('level', 'level', { unique: false });
          grammarStore.createIndex('title', 'title', { unique: false });
          grammarStore.createIndex('category', 'category', { unique: false });
          grammarStore.createIndex('level_id', ['level', 'id'], { unique: false });
        }

        // 10. Content Store: Vocab
        if (!db.objectStoreNames.contains('vocab')) {
          const vocabStore = db.createObjectStore('vocab', { keyPath: 'id' });
          vocabStore.createIndex('level', 'level', { unique: false });
          vocabStore.createIndex('front', 'front', { unique: false });
          vocabStore.createIndex('hanViet', 'hanViet', { unique: false });
          vocabStore.createIndex('level_id', ['level', 'id'], { unique: false });
        }

        // 11. Content Store: Kana
        if (!db.objectStoreNames.contains('kana')) {
          const kanaStore = db.createObjectStore('kana', { keyPath: 'id' });
          kanaStore.createIndex('type', 'type', { unique: false });
          kanaStore.createIndex('category', 'category', { unique: false });
          kanaStore.createIndex('romaji', 'romaji', { unique: false });
        }

        // 12. Content Store: Readings (Dokkai)
        if (!db.objectStoreNames.contains('readings')) {
          const readingsStore = db.createObjectStore('readings', { keyPath: 'id' });
          readingsStore.createIndex('level', 'level', { unique: false });
        }

        // 13. System Meta Store
        if (!db.objectStoreNames.contains('db_meta')) {
          db.createObjectStore('db_meta', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // ==========================================
  // --- METADATA & DATA CHUNK INDEXING ---
  // ==========================================

  async getMeta<T = unknown>(key: string): Promise<T | null> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('db_meta', 'readonly');
      const store = tx.objectStore('db_meta');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => resolve(null);
    });
  }

  async setMeta<T = unknown>(key: string, value: T): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('db_meta', 'readwrite');
      const store = tx.objectStore('db_meta');
      const req = store.put({ key, value, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async bulkSaveChunk<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
    if (!items || items.length === 0) return;
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      for (const item of items) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // ==========================================
  // --- KANJI OPERATIONS & SEARCH ---
  // ==========================================

  async getAllKanji(): Promise<KanjiItem[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('kanji', 'readonly');
      const store = tx.objectStore('kanji');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getKanjiByLevel(level: JLPTLevel): Promise<KanjiItem[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('kanji', 'readonly');
      const store = tx.objectStore('kanji');
      const index = store.index('level');
      const req = index.getAll(level);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async searchKanji(query: string, level?: JLPTLevel): Promise<KanjiItem[]> {
    const list = level ? await this.getKanjiByLevel(level) : await this.getAllKanji();
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((k) => {
      return (
        k.kanji.includes(q) ||
        k.hanViet.toLowerCase().includes(q) ||
        k.meaningVi.toLowerCase().includes(q) ||
        k.onyomi.some((on) => on.toLowerCase().includes(q)) ||
        k.kunyomi.some((kun) => kun.toLowerCase().includes(q)) ||
        k.jukugo.some((j) => j.kanji.includes(q) || j.hiragana.includes(q) || j.hanViet.toLowerCase().includes(q) || j.meaningVi.toLowerCase().includes(q))
      );
    });
  }

  // ==========================================
  // --- GRAMMAR OPERATIONS & SEARCH ---
  // ==========================================

  async getAllGrammar(): Promise<GrammarItem[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('grammar', 'readonly');
      const store = tx.objectStore('grammar');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getGrammarByLevel(level: JLPTLevel): Promise<GrammarItem[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('grammar', 'readonly');
      const store = tx.objectStore('grammar');
      const index = store.index('level');
      const req = index.getAll(level);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async searchGrammar(query: string, level?: JLPTLevel): Promise<GrammarItem[]> {
    const list = level ? await this.getGrammarByLevel(level) : await this.getAllGrammar();
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((g) => {
      return (
        g.title.toLowerCase().includes(q) ||
        g.formation.toLowerCase().includes(q) ||
        g.meaningVi.toLowerCase().includes(q) ||
        g.explanationVi.toLowerCase().includes(q) ||
        g.examples.some((ex) => ex.jp.includes(q) || ex.vi.toLowerCase().includes(q))
      );
    });
  }

  // ==========================================
  // --- KANA OPERATIONS ---
  // ==========================================

  async getAllKana(): Promise<KanaItem[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('kana', 'readonly');
      const store = tx.objectStore('kana');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // ==========================================
  // --- READINGS (DOKKAI) OPERATIONS ---
  // ==========================================

  async getReadingsByLevel(level: 'N4' | 'N3'): Promise<ReadingItem[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('readings', 'readonly');
      const store = tx.objectStore('readings');
      const index = store.index('level');
      const req = index.getAll(level);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllReadings(): Promise<ReadingItem[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('readings', 'readonly');
      const store = tx.objectStore('readings');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // ==========================================
  // --- SRS OPERATIONS ---
  // ==========================================

  async getAllCards(): Promise<SRSCard[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('srs_cards', 'readonly');
      const store = tx.objectStore('srs_cards');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getCardsByLevel(level: string): Promise<SRSCard[]> {
    const cards = await this.getAllCards();
    return cards.filter((c) => c.level === level);
  }

  async saveCard(card: SRSCard): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('srs_cards', 'readwrite');
      const store = tx.objectStore('srs_cards');
      const req = store.put(card);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async bulkSaveCards(cards: SRSCard[]): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('srs_cards', 'readwrite');
      const store = tx.objectStore('srs_cards');
      for (const card of cards) {
        store.put(card);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // ==========================================
  // --- USER STATS & DAILY STREAKS ---
  // ==========================================

  async getStats(): Promise<UserStats> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('user_stats', 'readonly');
      const store = tx.objectStore('user_stats');
      const req = store.get('stats');
      req.onsuccess = () => {
        const defaultStats: UserStats = {
          streak: 1,
          lastActiveDate: new Date().toISOString().slice(0, 10),
          cardsMasteredN5: 0,
          cardsMasteredN4: 0,
          cardsMasteredN3: 0,
          totalReviewsCompleted: 0,
          kanaSpeedBest: 0,
        };
        resolve(req.result?.value || defaultStats);
      };
      req.onerror = () => {
        resolve({
          streak: 1,
          lastActiveDate: new Date().toISOString().slice(0, 10),
          cardsMasteredN5: 0,
          cardsMasteredN4: 0,
          cardsMasteredN3: 0,
          totalReviewsCompleted: 0,
          kanaSpeedBest: 0,
        });
      };
    });
  }

  async saveStats(stats: UserStats): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('user_stats', 'readwrite');
      const store = tx.objectStore('user_stats');
      const req = store.put({ key: 'stats', value: stats });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async recordDailyActivity(reviewsDelta: number = 1, minutesDelta: number = 0): Promise<DailyStreakRecord> {
    const db = await this.openDB();
    const today = new Date().toISOString().slice(0, 10);

    return new Promise((resolve, reject) => {
      const tx = db.transaction('study_streaks', 'readwrite');
      const store = tx.objectStore('study_streaks');
      const req = store.get(today);

      req.onsuccess = () => {
        const existing: DailyStreakRecord = req.result || {
          date: today,
          reviewsCount: 0,
          durationMinutes: 0,
        };
        existing.reviewsCount += reviewsDelta;
        existing.durationMinutes += minutesDelta;
        store.put(existing);
        resolve(existing);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getDailyStreaks(limitDays: number = 30): Promise<DailyStreakRecord[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('study_streaks', 'readonly');
      const store = tx.objectStore('study_streaks');
      const req = store.getAll();
      req.onsuccess = () => {
        const list: DailyStreakRecord[] = req.result || [];
        list.sort((a, b) => b.date.localeCompare(a.date));
        resolve(list.slice(0, limitDays));
      };
      req.onerror = () => resolve([]);
    });
  }

  // ==========================================
  // --- USER HISTORY (QUIZ / GAMES / REVIEWS) ---
  // ==========================================

  async addHistoryRecord(record: Omit<HistoryRecord, 'id'>): Promise<string> {
    const db = await this.openDB();
    const id = `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullRecord: HistoryRecord = { ...record, id };

    return new Promise((resolve, reject) => {
      const tx = db.transaction('user_history', 'readwrite');
      const store = tx.objectStore('user_history');
      const req = store.put(fullRecord);
      req.onsuccess = () => resolve(id);
      req.onerror = () => reject(req.error);
    });
  }

  async getRecentHistory(limit: number = 50): Promise<HistoryRecord[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('user_history', 'readonly');
      const store = tx.objectStore('user_history');
      const req = store.getAll();
      req.onsuccess = () => {
        const list: HistoryRecord[] = req.result || [];
        list.sort((a, b) => b.timestamp - a.timestamp);
        resolve(list.slice(0, limit));
      };
      req.onerror = () => resolve([]);
    });
  }

  // ==========================================
  // --- BOOKMARKS & CUSTOM TAGS ---
  // ==========================================

  async getBookmarks(): Promise<string[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('bookmarks', 'readonly');
      const store = tx.objectStore('bookmarks');
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []).map((r: { id: string }) => r.id));
      req.onerror = () => resolve([]);
    });
  }

  async toggleBookmark(id: string): Promise<boolean> {
    const db = await this.openDB();
    const bookmarks = await this.getBookmarks();
    const exists = bookmarks.includes(id);

    return new Promise((resolve, reject) => {
      const tx = db.transaction(['bookmarks', 'bookmarked_items'], 'readwrite');
      const bmStore = tx.objectStore('bookmarks');
      const itemStore = tx.objectStore('bookmarked_items');

      if (exists) {
        bmStore.delete(id);
        itemStore.delete(id);
      } else {
        bmStore.put({ id, timestamp: Date.now() });
        itemStore.put({
          id,
          itemType: 'vocab',
          level: 'N5',
          timestamp: Date.now(),
        });
      }

      tx.oncomplete = () => resolve(!exists);
      tx.onerror = () => reject(tx.error);
    });
  }

  async saveBookmarkItem(item: BookmarkRecord): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['bookmarks', 'bookmarked_items'], 'readwrite');
      tx.objectStore('bookmarks').put({ id: item.id, timestamp: item.timestamp });
      tx.objectStore('bookmarked_items').put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getBookmarkedItems(itemType?: string): Promise<BookmarkRecord[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('bookmarked_items', 'readonly');
      const store = tx.objectStore('bookmarked_items');
      const req = store.getAll();
      req.onsuccess = () => {
        let list: BookmarkRecord[] = req.result || [];
        if (itemType) {
          list = list.filter((b) => b.itemType === itemType);
        }
        list.sort((a, b) => b.timestamp - a.timestamp);
        resolve(list);
      };
      req.onerror = () => resolve([]);
    });
  }

  async getCustomTags(): Promise<CustomTag[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('custom_tags', 'readonly');
      const store = tx.objectStore('custom_tags');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async saveCustomTag(tag: CustomTag): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('custom_tags', 'readwrite');
      const store = tx.objectStore('custom_tags');
      const req = store.put(tag);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ==========================================
  // --- 1-CLICK EXPORT / IMPORT (BLOB & STREAM READY) ---
  // ==========================================

  async exportFullBackup(): Promise<string> {
    const cards = await this.getAllCards();
    const stats = await this.getStats();
    const bookmarks = await this.getBookmarks();
    const bookmarkedItems = await this.getBookmarkedItems();
    const streaks = await this.getDailyStreaks(365);
    const history = await this.getRecentHistory(100);
    const tags = await this.getCustomTags();

    const payload = {
      app: 'Orca JP',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      stats,
      bookmarks,
      bookmarkedItems,
      streaks,
      history,
      tags,
      cards,
    };

    return JSON.stringify(payload, null, 2);
  }

  async exportFullBackupBlob(): Promise<Blob> {
    const jsonStr = await this.exportFullBackup();
    return new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  }

  async importFullBackup(jsonContent: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || !parsed.cards) return false;

      const db = await this.openDB();
      const stores = ['srs_cards', 'user_stats', 'bookmarks', 'bookmarked_items', 'study_streaks', 'user_history', 'custom_tags'];
      const tx = db.transaction(stores, 'readwrite');

      // Clear & restore cards
      const srsStore = tx.objectStore('srs_cards');
      srsStore.clear();
      for (const card of parsed.cards) {
        srsStore.put(card);
      }

      // Restore stats
      if (parsed.stats) {
        const statsStore = tx.objectStore('user_stats');
        statsStore.put({ key: 'stats', value: parsed.stats });
      }

      // Restore bookmarks
      if (Array.isArray(parsed.bookmarks)) {
        const bmStore = tx.objectStore('bookmarks');
        bmStore.clear();
        for (const b of parsed.bookmarks) {
          const id = typeof b === 'string' ? b : b.id;
          bmStore.put({ id, timestamp: Date.now() });
        }
      }

      // Restore bookmarked items
      if (Array.isArray(parsed.bookmarkedItems)) {
        const itemStore = tx.objectStore('bookmarked_items');
        itemStore.clear();
        for (const item of parsed.bookmarkedItems) {
          itemStore.put(item);
        }
      }

      // Restore streaks
      if (Array.isArray(parsed.streaks)) {
        const streakStore = tx.objectStore('study_streaks');
        streakStore.clear();
        for (const s of parsed.streaks) {
          streakStore.put(s);
        }
      }

      // Restore history
      if (Array.isArray(parsed.history)) {
        const histStore = tx.objectStore('user_history');
        histStore.clear();
        for (const h of parsed.history) {
          histStore.put(h);
        }
      }

      // Restore custom tags
      if (Array.isArray(parsed.tags)) {
        const tagStore = tx.objectStore('custom_tags');
        tagStore.clear();
        for (const t of parsed.tags) {
          tagStore.put(t);
        }
      }

      return new Promise((resolve) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }

  async importFullBackupBlob(file: File | Blob): Promise<boolean> {
    try {
      const text = await file.text();
      return this.importFullBackup(text);
    } catch {
      return false;
    }
  }
}

export const dbInstance = new OrcaIndexedDB();
