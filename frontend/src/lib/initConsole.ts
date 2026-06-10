/**
 * Console Suppression for Production
 * This file is auto-executed to suppress console logs in production builds
 */

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Suppress all console methods except error and warn
  const noop = () => {};
  
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.trace = noop;
  console.table = noop;
  console.group = noop;
  console.groupCollapsed = noop;
  console.groupEnd = noop;
  
  // Keep error and warn for critical issues (but could be removed too)
  // console.error = noop;
  // console.warn = noop;
}
