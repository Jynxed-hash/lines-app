/**
 * Paired light/dark tokens for Lines.
 * Dark canvas is sidewalk-at-1am (#0F0F23), not OLED #000.
 * CTA is orange with navy type so contrast stays ≥4.5:1.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1E293B',
    textSecondary: '#475569',
    background: '#F8FAFC',
    backgroundElement: '#EEF2FF',
    backgroundSelected: '#E0E7FF',
    primary: '#F97316',
    onPrimary: '#0F172A',
    accent: '#2563EB',
    onAccent: '#FFFFFF',
    danger: '#DC2626',
    onDanger: '#FFFFFF',
    border: '#CBD5E1',
    focus: '#2563EB',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    background: '#0F0F23',
    backgroundElement: '#1B1B30',
    backgroundSelected: '#27273B',
    primary: '#F97316',
    onPrimary: '#0F172A',
    accent: '#818CF8',
    onAccent: '#0F0F23',
    danger: '#F87171',
    onDanger: '#0F0F23',
    border: '#3F3F63',
    focus: '#F97316',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
    display: 'ui-rounded',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    display: 'sans-serif',
  },
  web: {
    sans: 'Poppins, var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
    display: 'Righteous, var(--font-display)',
  },
}) ?? {
  sans: 'sans-serif',
  serif: 'serif',
  rounded: 'sans-serif',
  mono: 'monospace',
  display: 'sans-serif',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const Touch = {
  min: 44,
} as const;

export const Motion = {
  pressIn: 180,
  pressOut: 220,
  pressScale: 0.97,
} as const;

export const IconSize = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 80, default: 56 }) ?? 56;
export const MaxContentWidth = 800;
