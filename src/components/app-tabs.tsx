import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      iconColor={{ default: colors.textSecondary, selected: colors.primary }}
      labelStyle={{
        default: { color: colors.textSecondary },
        selected: { color: colors.primary },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Tonight</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'moon.stars', selected: 'moon.stars.fill' }}
          md="nightlife"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="queue">
        <NativeTabs.Trigger.Label>Queue</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.3', selected: 'person.3.fill' }}
          md="groups"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="door">
        <NativeTabs.Trigger.Label>Door</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'lock', selected: 'lock.fill' }}
          md="lock"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
