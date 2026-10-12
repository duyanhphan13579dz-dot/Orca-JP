import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { OrcaIndexedDB } from '../db/indexdb';
import { SRSCard, UserStats, DailyStreakRecord } from '../types';

export function useCloudSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('orca_last_sync_time');
    return saved ? parseInt(saved, 10) : null;
  });

  const syncProgressMutation = useMutation(api.users.syncProgress);
  const cloudProgress = useQuery(api.users.getProgress);

  // 1. Push local IndexedDB data to Convex Cloud
  const pushToCloud = useCallback(async (): Promise<boolean> => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const db = new OrcaIndexedDB();
      const srsCards = await db.getAllCards();
      const stats = await db.getStats();
      const streaks = await db.getDailyStreaks(365);

      await syncProgressMutation({
        srsCardsJson: JSON.stringify(srsCards),
        statsJson: JSON.stringify(stats),
        streakJson: JSON.stringify(streaks),
      });

      const now = Date.now();
      localStorage.setItem('orca_last_sync_time', String(now));
      setLastSyncTime(now);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncError(msg);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [syncProgressMutation]);

  // 2. Pull data from Convex Cloud and restore into local IndexedDB
  const pullFromCloud = useCallback(async (): Promise<boolean> => {
    if (!cloudProgress) return false;
    setIsSyncing(true);
    setSyncError(null);
    try {
      const db = new OrcaIndexedDB();

      if (cloudProgress.srsCardsJson) {
        const cards: SRSCard[] = JSON.parse(cloudProgress.srsCardsJson);
        for (const card of cards) {
          await db.saveCard(card);
        }
      }

      if (cloudProgress.statsJson) {
        const stats: UserStats = JSON.parse(cloudProgress.statsJson);
        await db.saveStats(stats);
      }

      if (cloudProgress.streakJson) {
        const streaks: DailyStreakRecord[] = JSON.parse(cloudProgress.streakJson);
        for (const st of streaks) {
          await db.recordDailyActivity(st.reviewsCount, st.durationMinutes);
        }
      }

      const now = Date.now();
      localStorage.setItem('orca_last_sync_time', String(now));
      setLastSyncTime(now);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncError(msg);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [cloudProgress]);

  return {
    isSyncing,
    syncError,
    lastSyncTime,
    cloudProgress,
    pushToCloud,
    pullFromCloud,
  };
}
