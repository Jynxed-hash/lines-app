/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Platform } from 'react-native';

import { Colors, GlassTokens, WebColors, WebGlassTokens } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useResolvedScheme(): 'light' | 'dark' {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

export function useTheme() {
  const scheme = useResolvedScheme();

  if (Platform.OS === 'web') {
    return WebColors;
  }

  return Colors[scheme];
}

export function useGlassTokens() {
  const scheme = useResolvedScheme();

  if (Platform.OS === 'web') {
    return WebGlassTokens;
  }

  return GlassTokens[scheme];
}

export function usePalette() {
  return Colors[useResolvedScheme()];
}
