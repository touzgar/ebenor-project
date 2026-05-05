'use client';

/**
 * Test page to trigger error boundary
 * Navigate to /test-error to see the error.tsx page in action
 * DELETE THIS FILE after testing
 */
export default function TestError() {
  // This will trigger the error boundary
  throw new Error('Test error: This is a simulated error to test the error boundary');
  
  return <div>This will never render</div>;
}
