import { useEffect, useState } from 'react';

/**
 * Hook to check if component is mounted on client side
 * Prevents hydration mismatches
 */
export function useClientOnly() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Component wrapper that only renders children on client side
 * Use this for components that might cause hydration mismatches
 */
interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useClientOnly();

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}