/**
 * Suppress console logs in production environment
 * This keeps error and warn messages but removes all debug logging
 */
export function suppressConsoleInProduction() {
  if (typeof window === 'undefined') return;
  
  // Only suppress in production
  if (process.env.NODE_ENV === 'production') {
    const noop = () => {};
    
    // Suppress debug logs
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.trace = noop;
    
    // Keep error and warn for critical issues
    // Optionally uncomment below to suppress all console output
    // console.error = noop;
    // console.warn = noop;
  }
}
