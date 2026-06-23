/**
 * IMMEDIATE CONSOLE SILENCE
 * This runs FIRST before any React code
 */
(function() {
  'use strict';
  
  // Completely disable console
  var noop = function() {};
  
  window.console = {
    log: noop,
    warn: noop,
    error: noop,
    info: noop,
    debug: noop,
    trace: noop,
    table: noop,
    dir: noop,
    dirxml: noop,
    group: noop,
    groupCollapsed: noop,
    groupEnd: noop,
    time: noop,
    timeEnd: noop,
    timeLog: noop,
    timeStamp: noop,
    count: noop,
    countReset: noop,
    assert: noop,
    clear: noop,
    profile: noop,
    profileEnd: noop,
  };
  
  // Block ALL errors
  window.addEventListener('error', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  }, true);
  
  // Block ALL promise rejections
  window.addEventListener('unhandledrejection', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  }, true);
  
  window.addEventListener('rejectionhandled', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  }, true);
  
  // Override error handlers
  window.onerror = function() { return true; };
  window.onunhandledrejection = function() { return true; };
  
  // Make console non-configurable
  try {
    Object.defineProperty(window, 'console', {
      value: window.console,
      writable: false,
      configurable: false
    });
  } catch(e) {}
  
})();
