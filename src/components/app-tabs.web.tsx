import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, View, StyleSheet } from 'react-native';

import { ExternalLink } from './external-link';
import { GlassFamily, GlassSurface } from './glass';
import { ThemedText } from './themed-text';

import { GlassPillRadius, HitTarget, MaxContentWidth, Spacing } from '@/constants/theme';
import { usePalette, useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="tonight" href="/" asChild>
            <TabButton>Tonight</TabButton>
          </TabTrigger>
          <TabTrigger name="queue" href="/queue" asChild>
            <TabButton>Queue</TabButton>
          </TabTrigger>
          <TabTrigger name="door" href="/door" asChild>
            <TabButton>Door</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      style={({ pressed }) => [
        styles.tabPressable,
        {
          backgroundColor: isFocused ? theme.backgroundSelected : 'transparent',
        },
        pressed && styles.pressed,
      ]}>
      <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const colors = usePalette();

  return (
    <View {...props} style={styles.tabListContainer}>
      <GlassFamily style={styles.family}>
        <GlassSurface radius={GlassPillRadius} style={styles.innerContainer}>
          <ThemedText type="smallBold" style={styles.brandText}>
            Lines
          </ThemedText>

          {props.children}

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={styles.externalPressable}>
              <ThemedText type="link">Docs</ThemedText>
              <SymbolView
                tintColor={colors.text}
                name={{ ios: 'arrow.up.right.square', web: 'link' }}
                size={12}
              />
            </Pressable>
          </ExternalLink>
        </GlassSurface>
      </GlassFamily>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  family: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.88,
  },
  tabPressable: {
    minHeight: HitTarget,
    minWidth: HitTarget,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
  },
  externalPressable: {
    minHeight: HitTarget,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});
