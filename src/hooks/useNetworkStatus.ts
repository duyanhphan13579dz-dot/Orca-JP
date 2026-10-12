import { useState, useEffect } from 'react';
import { useConvexConnectionState } from 'convex/react';

export interface NetworkStatus {
  isOnline: boolean;
  isCloudConnected: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const connectionState = useConvexConnectionState();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isCloudConnected = isOnline && Boolean(connectionState?.isWebSocketConnected);

  return {
    isOnline,
    isCloudConnected,
  };
}
