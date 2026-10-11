import { SRSCard, UserStats } from '../types';

const DB_NAME = 'OrcaJP_Database';
const DB_VERSION = 1;

export class OrcaIndexedDB {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // SRS cards store
        if (!db.objectStoreNames.contains('srs_cards')) {
          const srsStore = db.createObjectStore('srs_cards', { keyPath: 'id' });
          srsStore.createIndex('level', 'level', { unique: false });
          srsStore.createIndex('dueDate', 'dueDate', { unique: false });
          srsStore.createIndex('status', 'status', { unique: false });
        }

        // User stats store
        if (!db.objectStoreNames.contains('user_stats')) {
          db.createObjectStore('user_stats', { keyPath: 'key' });
        }

        // Bookmarks / Favorites store
        if (!db.objectStoreNames.contains('bookmarks')) {
          db.createObjectStore('bookmarks', { keyPath: 'id' });
        }

        // Quiz history store
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // --- SRS Operations ---
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
    return cards.filter(c => c.level === level);
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

  // --- Stats Operations ---
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

  // --- Bookmarks ---
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
      const tx = db.transaction('bookmarks', 'readwrite');
      const store = tx.objectStore('bookmarks');
      if (exists) {
        store.delete(id);
      } else {
        store.put({ id, timestamp: Date.now() });
      }
      tx.oncomplete = () => resolve(!exists);
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- 1-Click Export / Import ---
  async exportFullBackup(): Promise<string> {
    const cards = await this.getAllCards();
    const stats = await this.getStats();
    const bookmarks = await this.getBookmarks();

    const payload = {
      app: 'Orca JP',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      stats,
      bookmarks,
      cards,
    };

    return JSON.stringify(payload, null, 2);
  }

  async importFullBackup(jsonContent: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || !parsed.cards) return false;

      const db = await this.openDB();
      const tx = db.transaction(['srs_cards', 'user_stats'], 'readwrite');
      const srsStore = tx.objectStore('srs_cards');
      const statsStore = tx.objectStore('user_stats');

      // Clear & put
      srsStore.clear();
      for (const card of parsed.cards) {
        srsStore.put(card);
      }

      if (parsed.stats) {
        statsStore.put({ key: 'stats', value: parsed.stats });
      }

      return new Promise((resolve) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }
}

export const dbInstance = new OrcaIndexedDB();
