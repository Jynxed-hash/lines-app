import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { prepareNotifications } from '@/lib/notify';
import { NightProvider } from '@/state/night-session';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme];

  const navigationTheme = useMemo<Theme>(() => {
    const base = colorScheme === 'light' ? DefaultTheme : DarkTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: palette.primary,
        background: palette.background,
        card: palette.background,
        text: palette.text,
        border: palette.border,
        notification: palette.primary,
      },
    };
  }, [colorScheme, palette]);

  useEffect(() => {
    void prepareNotifications();
  }, []);

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />
      <NightProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
      </NightProvider>
    </ThemeProvider>
  );
}
