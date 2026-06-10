'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface DashboardContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    const newKey = Date.now();
    console.log('🔄 Dashboard refresh triggered from context - new key:', newKey);
    setRefreshKey(newKey);
  }, []);

  // Listen for custom events AND BroadcastChannel
  useEffect(() => {
    console.log('👂 DashboardProvider: Setting up event listeners');
    
    // BroadcastChannel for cross-tab communication (more reliable)
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('dashboard-refresh-channel');
      channel.onmessage = (event) => {
        console.log('📡 BroadcastChannel message received:', event.data);
        if (event.data.type === 'refresh') {
          triggerRefresh();
        }
      };
      console.log('✅ BroadcastChannel created successfully');
    } catch (error) {
      console.warn('⚠️ BroadcastChannel not supported, using fallback');
    }
    
    const handleRefresh = (e: Event) => {
      console.log('📡 Received dashboard-refresh event:', e);
      triggerRefresh();
    };

    // Listen for postMessage fallback
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = e.data;
        // Only respond to dashboard-refresh messages from our app
        if (data && typeof data === 'object' && data.type === 'dashboard-refresh') {
          console.log('📡 Received postMessage dashboard-refresh:', data);
          triggerRefresh();
          // Do NOT return true here to avoid async response issues
        }
      } catch (err) {
        // Silently ignore unrelated messages (e.g., from browser extensions)
        if (process.env.NODE_ENV === 'development') {
          console.debug('ℹ️ Ignored message event:', err);
        }
      }
    };

    // Listen for storage events (cross-tab fallback)
    const handleStorage = (e: StorageEvent) => {
      console.log('📡 Storage event received:', e.key, e.newValue);
      if (e.key === 'dashboard-last-refresh') {
        console.log('📡 Cross-tab refresh detected!');
        triggerRefresh();
      }
    };

    window.addEventListener('dashboard-refresh', handleRefresh);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('message', handleMessage);

    console.log('✅ Event listeners attached successfully');

    return () => {
      console.log('🧹 Cleaning up event listeners');
      window.removeEventListener('dashboard-refresh', handleRefresh);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('message', handleMessage);
      if (channel) {
        channel.close();
      }
    };
  }, [triggerRefresh]);

  return (
    <DashboardContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardRefresh() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    // Fallback: Return dummy functions if context is not available
    console.warn('⚠️ useDashboardRefresh used outside DashboardProvider - using fallback');
    return {
      refreshKey: 0,
      triggerRefresh: () => console.warn('⚠️ triggerRefresh called outside DashboardProvider'),
    };
  }
  return context;
}
