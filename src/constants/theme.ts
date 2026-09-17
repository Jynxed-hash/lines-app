import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1612',
    textSecondary: '#6F6558',
    background: '#F3EDE1',
    backgroundElement: '#E8DFD0',
    backgroundSelected: '#D9CCB8',
    hairline: '#C9BBA6',
    accent: '#C47A0A',
    onAccent: '#F3EDE1',
    called: '#3D6B2F',
    danger: '#8C3A2A',
  },
  dark: {
    text: '#F4EDE0',
    textSecondary: '#9C9180',
    background: '#12100C',
    backgroundElement: '#1C1914',
    backgroundSelected: '#2A241C',
    hairline: '#3A342C',
    accent: '#E8A317',
    onAccent: '#12100C',
    called: '#C6E07A',
    danger: '#D48A78',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  web: {
    sans: 'var(--font-sans)',
    sansMedium: 'var(--font-sans)',
    sansSemiBold: 'var(--font-sans)',
    serif: 'var(--font-serif)',
    number: 'var(--font-number)',
    mono: 'var(--font-mono)',
  },
  default: {
    sans: 'InstrumentSans',
    sansMedium: 'InstrumentSansMedium',
    sansSemiBold: 'InstrumentSansSemiBold',
    serif: 'Fraunces',
    number: 'SairaExtraCondensed',
    mono: 'IBMPlexMono',
  },
});

export const Type = {
  kicker: { fontSize: 11, lineHeight: 14, letterSpacing: 1.6, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
  venue: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  screenTitle: { fontSize: 40, lineHeight: 44, fontWeight: '600' as const },
  wait: { fontSize: 44, lineHeight: 44, fontWeight: '800' as const },
  position: { fontSize: 120, lineHeight: 108, fontWeight: '800' as const, letterSpacing: -4 },
} as const;

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
  ticket: 2,
  sm: 4,
  md: 8,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 430;
