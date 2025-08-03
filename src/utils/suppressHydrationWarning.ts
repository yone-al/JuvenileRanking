/**
 * Utility to suppress hydration warnings for specific cases
 * Use sparingly and only for legitimate cases like timestamps
 */
export function suppressHydrationWarning() {
  return {
    suppressHydrationWarning: true
  };
}

/**
 * Format time consistently between server and client
 */
export function formatTimeForHydration(date: Date | null): string {
  if (!date) return '';
  
  // Use a simple format that's consistent across environments
  return date.toISOString().slice(11, 19); // HH:MM:SS format
}

/**
 * Check if we're running on the client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if we're running on the server side
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}