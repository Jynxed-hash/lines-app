import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS, Platform } from 'react-native';

import { Colors } from '@/constants/theme';
import { usePalette } from '@/hooks/use-theme';

function iosDynamic(light: string, dark: string) {
  if (Platform.OS !== 'ios') {
    return light;
  }

  return DynamicColorIOS({ light, dark });
}

export default function AppTabs() {
  const colors = usePalette();
  const contentStyle = { backgroundColor: colors.background };
  const tint = iosDynamic(Colors.light.text, Colors.dark.text);
  const muted = iosDynamic(Colors.light.textSecondary, Colors.dark.textSecondary);

  return (
    <NativeTabs
      {...(Platform.OS === 'ios'
        ? { blurEffect: 'systemChromeMaterial' as const, minimizeBehavior: 'automatic' as const }
        : { backgroundColor: colors.background })}
      indicatorColor={colors.backgroundElement}
      tintColor={Platform.OS === 'ios' ? tint : colors.text}
      labelStyle={{
        color: Platform.OS === 'ios' ? muted : colors.textSecondary,
        selected: { color: Platform.OS === 'ios' ? tint : colors.text },
      }}>
      <NativeTabs.Trigger name="index" contentStyle={contentStyle}>
        <NativeTabs.Trigger.Label>Tonight</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="queue" contentStyle={contentStyle}>
        <NativeTabs.Trigger.Label>Queue</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="door" contentStyle={contentStyle}>
        <NativeTabs.Trigger.Label>Door</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
