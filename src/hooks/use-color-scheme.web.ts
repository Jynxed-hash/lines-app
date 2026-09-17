import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

function schemeFromMedia(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Paint with CSS variables (see global.css) so SSR Tonight and client Queue/Door
 * share one scheme. JS follows prefers-color-scheme instead of forcing light.
 */
export function useColorScheme(): 'light' | 'dark' {
  const [scheme, setScheme] = useState<'light' | 'dark'>(schemeFromMedia);
  const nativeScheme = useRNColorScheme();

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setScheme(media.matches ? 'dark' : 'light');
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  if (nativeScheme === 'dark' || nativeScheme === 'light') {
    return nativeScheme;
  }

  return scheme;
}
