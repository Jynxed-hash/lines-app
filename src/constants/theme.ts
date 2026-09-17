/**
 * Sidewalk palette — same family in light and dark so Tonight / Queue / Door
 * never drift apart. Glass tokens keep fallback fills opaque enough for 4.5:1.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1916',
    background: '#E8E4DC',
    backgroundElement: '#F3EFE7',
    backgroundSelected: '#DDD6CA',
    textSecondary: '#3F3C37',
  },
  dark: {
    text: '#F4F2EE',
    background: '#121114',
    backgroundElement: '#1C1B1F',
    backgroundSelected: '#2A292E',
    textSecondary: '#C9C4BB',
  },
} as const;

export const GlassTokens = {
  light: {
    tint: 'rgba(255, 252, 247, 0.38)',
    fill: 'rgba(255, 252, 247, 0.86)',
    stroke: 'rgba(26, 25, 22, 0.14)',
    ctaTint: 'rgba(42, 40, 36, 0.55)',
    ctaFill: '#2A2824',
    ctaLabel: '#F7F4EE',
  },
  dark: {
    tint: 'rgba(28, 26, 32, 0.42)',
    fill: 'rgba(22, 20, 26, 0.86)',
    stroke: 'rgba(244, 242, 238, 0.16)',
    ctaTint: 'rgba(244, 242, 238, 0.42)',
    ctaFill: '#F4F2EE',
    ctaLabel: '#161418',
  },
} as const;

export const WebColors = {
  text: 'var(--lines-text)',
  background: 'var(--lines-bg)',
  backgroundElement: 'var(--lines-element)',
  backgroundSelected: 'var(--lines-selected)',
  textSecondary: 'var(--lines-text-secondary)',
} as const;

export const WebGlassTokens = {
  tint: 'var(--lines-glass-tint)',
  fill: 'var(--lines-glass-fill)',
  stroke: 'var(--lines-glass-stroke)',
  ctaTint: 'var(--lines-cta-tint)',
  ctaFill: 'var(--lines-cta-fill)',
  ctaLabel: 'var(--lines-cta-label)',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Apple HIG minimum control size — used for every tappable chrome. */
export const HitTarget = 44;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 24 }) ?? 0;
export const TopChromeInset = Platform.select({ web: 72, default: 0 }) ?? 0;
export const MaxContentWidth = 800;
export const GlassRadius = 20;
export const GlassPillRadius = 22;
export const GlassFamilySpacing = 16;
