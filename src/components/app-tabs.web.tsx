import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from './themed-text';
import { VectorIcon, type VectorIconName } from './vector-icon';

import { IconSize, MaxContentWidth, Motion, Radius, Spacing, Touch } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TAB_ICONS: Record<string, VectorIconName> = {
  Tonight: { ios: 'moon.stars.fill', android: 'nightlife', web: 'nightlife' },
  Queue: { ios: 'person.3.fill', android: 'groups', web: 'groups' },
  Door: { ios: 'lock.fill', android: 'lock', web: 'lock' },
};

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
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const label = typeof children === 'string' ? children : 'Tab';
  const icon = TAB_ICONS[label];
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * 0.16,
    transform: [{ scale: reduceMotion ? 1 : 1 - progress.value * (1 - Motion.pressScale) }],
  }));

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: Boolean(isFocused) }}
      onPressIn={(event) => {
        progress.value = withTiming(1, { duration: Motion.pressIn, easing: Easing.out(Easing.cubic) });
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        progress.value = withTiming(0, { duration: Motion.pressOut, easing: Easing.out(Easing.cubic) });
        props.onPressOut?.(event);
      }}
      style={styles.tabHit}>
      <Animated.View
        style={[
          styles.tabButtonView,
          {
            backgroundColor: isFocused ? theme.backgroundSelected : 'transparent',
            borderColor: isFocused ? theme.primary : 'transparent',
          },
          animatedStyle,
        ]}>
        {icon ? <VectorIcon name={icon} color={isFocused ? theme.primary : theme.textSecondary} size={IconSize.md} /> : null}
        <ThemedText type="smallBold" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[styles.tabListContainer, { paddingBottom: Math.max(insets.bottom, Spacing.two) }]}>
      <View
        style={[
          styles.innerContainer,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  tabHit: {
    flex: 1,
    minHeight: Touch.min,
    minWidth: Touch.min,
    cursor: 'pointer',
  },
  tabButtonView: {
    minHeight: Touch.min,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
});
