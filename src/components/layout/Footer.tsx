import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { storage } from '../../lib/storage';
import { startDataCollection } from '../../services/dataCollectionService';

export function Footer() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nextUpdate, setNextUpdate] = useState<number>(0);

  useEffect(() => {
    async function getLastUpdateTime() {
      const timestamp = await storage.get<number>('lastUpdate');
      if (timestamp) {
        setLastUpdate(new Date(timestamp));
      }
    }

    getLastUpdateTime();
    const interval = setInterval(() => {
      getLastUpdateTime();
      // Calculate time until next update (12 hours from last update)
      if (lastUpdate) {
        const nextUpdateTime = new Date(lastUpdate.getTime() + 12 * 60 * 60 * 1000);
        const timeUntilUpdate = Math.max(0, nextUpdateTime.getTime() - Date.now());
        setNextUpdate(Math.floor(timeUntilUpdate / (60 * 1000))); // Convert to minutes
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await startDataCollection();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <footer className="bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} AndroidGemisi. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {lastUpdate && (
              <span>
                Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </span>
            )}
            {nextUpdate > 0 && (
              <span>
                • Sonraki güncelleme: {nextUpdate} dakika sonra
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="ml-2 p-1 hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}