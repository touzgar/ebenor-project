/**
 * Dashboard Refresh Event System
 * Triggers dashboard refresh when products/gallery items are added/deleted
 */

export const DASHBOARD_REFRESH_EVENT = 'dashboard-refresh';
export const DASHBOARD_REFRESH_KEY = 'dashboard-last-refresh';

/**
 * Trigger dashboard refresh
 * This will update both the current tab and other tabs
 */
export function triggerDashboardRefresh() {
  const timestamp = Date.now();
  
  console.log('🚀 Triggering dashboard refresh:', timestamp);
  
  // Method 1: BroadcastChannel (most reliable for cross-tab)
  try {
    const channel = new BroadcastChannel('dashboard-refresh-channel');
    channel.postMessage({ type: 'refresh', timestamp });
    channel.close();
    console.log('✅ BroadcastChannel message sent');
  } catch (error) {
    console.warn('⚠️ BroadcastChannel failed:', error);
  }
  
  // Method 2: LocalStorage (fallback for cross-tab)
  try {
    localStorage.setItem(DASHBOARD_REFRESH_KEY, timestamp.toString());
    console.log('✅ LocalStorage updated');
  } catch (error) {
    console.warn('⚠️ LocalStorage failed:', error);
  }
  
  // Method 3: Custom event (same-page refresh)
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(DASHBOARD_REFRESH_EVENT, { detail: { timestamp }, bubbles: true });
    window.dispatchEvent(event);
    console.log('✅ Dashboard refresh event dispatched');

    // Method 4: postMessage fallback (more reliable in some environments)
    try {
      window.postMessage({ type: DASHBOARD_REFRESH_EVENT, timestamp }, window.location.origin || '*');
      console.log('✅ postMessage sent for dashboard refresh');
    } catch (err) {
      console.warn('⚠️ postMessage failed:', err);
    }
  }
}

/**
 * Listen for dashboard refresh events
 */
export function onDashboardRefresh(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  // Listen for custom events (same tab)
  const handleCustomEvent = () => {
    console.log('📡 Dashboard refresh event received');
    callback();
  };

  // Listen for storage events (other tabs)
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === DASHBOARD_REFRESH_KEY) {
      console.log('📡 Cross-tab dashboard refresh event received');
      callback();
    }
  };

  window.addEventListener(DASHBOARD_REFRESH_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  // Cleanup
  return () => {
    window.removeEventListener(DASHBOARD_REFRESH_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}
