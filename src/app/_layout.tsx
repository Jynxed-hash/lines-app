import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppFonts } from '@/lib/fonts';
import { prepareNotifications } from '@/lib/notify';
import { NightProvider } from '@/state/night-session';

SplashScreen.preventAutoHideAsync();

const NightDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.accent,
    background: Colors.dark.background,
    card: Colors.dark.background,
    text: Colors.dark.text,
    border: Colors.dark.hairline,
    notification: Colors.dark.accent,
  },
};

const NightLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.accent,
    background: Colors.light.background,
    card: Colors.light.background,
    text: Colors.light.text,
    border: Colors.light.hairline,
    notification: Colors.light.accent,
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useAppFonts();
  const isLight = colorScheme === 'light';

  useEffect(() => {
    void prepareNotifications();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={isLight ? NightLight : NightDark}>
      <NightProvider>
        <StatusBar style={isLight ? 'dark' : 'light'} />
        <AnimatedSplashOverlay />
        <AppTabs />
      </NightProvider>
    </ThemeProvider>
  );
}
