import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Nightlife default is dark so Tonight / Queue / Door share one canvas.
 * Static web used to paint light, then client-hydrate to the OS scheme —
 * Tonight stayed cream while Queue/Door went near-black.
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (!hasHydrated) {
    return 'dark';
  }

  if (colorScheme === 'light') {
    return 'light';
  }

  return 'dark';
}
