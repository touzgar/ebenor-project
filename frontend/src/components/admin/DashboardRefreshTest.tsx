'use client';

import { useDashboardRefresh } from '@/contexts/DashboardContext';
import { useEffect, useState } from 'react';

export function DashboardRefreshTest() {
  const { refreshKey, triggerRefresh } = useDashboardRefresh();
  const [lastUpdate, setLastUpdate] = useState<string>('Never');
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    if (refreshKey > 0) {
      setLastUpdate(new Date().toLocaleTimeString());
      setEventCount(prev => prev + 1);
      console.log('🎯 DashboardRefreshTest: refreshKey changed to', refreshKey);
    }
  }, [refreshKey]);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border-2 border-amber-500 z-50 min-w-[280px]">
      <div className="text-sm font-mono space-y-2">
        <div className="font-bold text-amber-600 text-center border-b border-amber-300 pb-2">
          🔄 Dashboard Debug
        </div>
        
        <div className="space-y-1">
          <div>
            <span className="text-gray-600">Refresh Key:</span>
            <span className="font-bold text-blue-600 ml-2">{refreshKey}</span>
          </div>
          
          <div>
            <span className="text-gray-600">Event Count:</span>
            <span className="font-bold text-green-600 ml-2">{eventCount}</span>
          </div>
          
          <div>
            <span className="text-gray-600">Last Update:</span>
            <span className="font-bold text-purple-600 ml-2 text-xs">{lastUpdate}</span>
          </div>
        </div>

        <button
          onClick={() => {
            console.log('🧪 Manual refresh test button clicked');
            triggerRefresh();
          }}
          className="w-full px-3 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors text-xs font-bold"
        >
          🧪 TEST REFRESH
        </button>
        
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Check console (F12) for logs
        </div>
      </div>
    </div>
  );
}
