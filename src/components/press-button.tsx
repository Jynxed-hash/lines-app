import type { ReactNode } from 'react';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { VectorIcon, type VectorIconName } from '@/components/vector-icon';
import { Motion, Radius, Spacing, Touch } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'primary' | 'secondary' | 'danger';

type PressButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  hint?: string;
  icon?: VectorIconName;
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
};

const easeOut = Easing.out(Easing.cubic);

function focusRing(focused: boolean | undefined, color: string): ViewStyle | undefined {
  if (!focused) return undefined;
  if (Platform.OS === 'web') {
    return { outlineWidth: 3, outlineStyle: 'solid', outlineColor: color };
  }
  return { borderColor: color, borderWidth: 2 };
}

export function PressButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  hint,
  icon,
  fill,
  style,
}: PressButtonProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const [focused, setFocused] = useState(false);

  const palette = {
    primary: { backgroundColor: theme.primary, color: theme.onPrimary },
    secondary: { backgroundColor: theme.backgroundSelected, color: theme.text },
    danger: { backgroundColor: theme.backgroundElement, color: theme.danger },
  }[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: disabled ? 0.4 : 1 - progress.value * 0.22,
    transform: [{ scale: reduceMotion ? 1 : 1 - progress.value * (1 - Motion.pressScale) }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        progress.value = withTiming(1, { duration: Motion.pressIn, easing: easeOut });
      }}
      onPressOut={() => {
        progress.value = withTiming(0, { duration: Motion.pressOut, easing: easeOut });
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.hit, fill && styles.fill, focusRing(focused, theme.focus), style]}>
      <Animated.View
        style={[
          styles.face,
          fill && styles.faceFill,
          { backgroundColor: palette.backgroundColor },
          animatedStyle,
        ]}>
        {icon ? <VectorIcon name={icon} color={palette.color} /> : null}
        <ThemedText type="smallBold" style={{ color: palette.color }}>
          {label}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

type ChoiceChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  hint?: string;
  icon?: VectorIconName;
};

export function ChoiceChip({ label, selected, onPress, hint, icon }: ChoiceChipProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const [focused, setFocused] = useState(false);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * 0.18,
    transform: [{ scale: reduceMotion ? 1 : 1 - progress.value * (1 - Motion.pressScale) }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ selected: Boolean(selected) }}
      onPress={onPress}
      onPressIn={() => {
        progress.value = withTiming(1, { duration: Motion.pressIn, easing: easeOut });
      }}
      onPressOut={() => {
        progress.value = withTiming(0, { duration: Motion.pressOut, easing: easeOut });
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.hit, focusRing(focused, theme.focus)]}>
      <Animated.View
        style={[
          styles.chip,
          {
            backgroundColor: selected ? theme.backgroundSelected : theme.backgroundElement,
            borderColor: selected ? theme.primary : theme.border,
          },
          animatedStyle,
        ]}>
        {icon ? <VectorIcon name={icon} color={selected ? theme.primary : theme.textSecondary} /> : null}
        <ThemedText type="smallBold" themeColor={selected ? 'text' : 'textSecondary'}>
          {label}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

type StepperProps = {
  label: string;
  onPress: () => void;
  children: ReactNode;
};

export function IconStepButton({ label, onPress, children }: StepperProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const [focused, setFocused] = useState(false);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * 0.2,
    transform: [{ scale: reduceMotion ? 1 : 1 - progress.value * (1 - Motion.pressScale) }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => {
        progress.value = withTiming(1, { duration: Motion.pressIn, easing: easeOut });
      }}
      onPressOut={() => {
        progress.value = withTiming(0, { duration: Motion.pressOut, easing: easeOut });
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.stepHit, focusRing(focused, theme.focus)]}>
      <Animated.View style={[styles.stepFace, { backgroundColor: theme.backgroundSelected }, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    minHeight: Touch.min,
    minWidth: Touch.min,
    cursor: 'pointer',
  },
  fill: {
    alignSelf: 'stretch',
  },
  faceFill: {
    alignSelf: 'stretch',
  },
  face: {
    minHeight: Touch.min,
    minWidth: Touch.min,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  chip: {
    minHeight: Touch.min,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  stepHit: {
    width: Touch.min,
    height: Touch.min,
    cursor: 'pointer',
  },
  stepFace: {
    width: Touch.min,
    height: Touch.min,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
