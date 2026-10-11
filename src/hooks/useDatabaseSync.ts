import { useState, useEffect, useCallback } from 'react';
import { dataLoader } from '../db/dataLoader';
import { DatabaseSyncStatus } from '../types';

export function useDatabaseSync() {
  const [syncStatus, setSyncStatus] = useState<DatabaseSyncStatus>(dataLoader.getStatus());

  useEffect(() => {
    const unsubscribe = dataLoader.subscribe((status) => {
      setSyncStatus(status);
    });

    // Auto-trigger initialization on mount
    dataLoader.initialize();

    return () => {
      unsubscribe();
    };
  }, []);

  const reload = useCallback(async () => {
    await dataLoader.initialize();
  }, []);

  return {
    syncStatus,
    isReady: syncStatus.status === 'ready',
    isLoading: syncStatus.status === 'loading',
    progress: syncStatus.progress,
    reload,
  };
}
