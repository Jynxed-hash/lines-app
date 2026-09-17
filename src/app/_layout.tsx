import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { prepareNotifications } from '@/lib/notify';
import { NightProvider } from '@/state/night-session';
import { useResolvedScheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const scheme = useResolvedScheme();

  useEffect(() => {
    void prepareNotifications();
  }, []);

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NightProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
      </NightProvider>
    </ThemeProvider>
  );
}
