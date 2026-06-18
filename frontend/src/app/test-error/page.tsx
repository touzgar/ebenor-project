'use client';

import { useEffect, useState } from 'react';

/**
 * Test page to trigger error boundary
 * Navigate to /test-error to see the error.tsx page in action
 * DELETE THIS FILE after testing
 */
export default function TestError() {
  const [shouldThrow, setShouldThrow] = useState(false);

  // Only throw error after component mounts (client-side only)
  useEffect(() => {
    setShouldThrow(true);
  }, []);

  if (shouldThrow) {
    throw new Error('Test error: This is a simulated error to test the error boundary');
  }
  
  return <div>Loading test error...</div>;
}
