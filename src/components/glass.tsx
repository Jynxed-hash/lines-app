import { GlassContainer, GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { type ReactNode, useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  type PressableProps,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  GlassFamilySpacing,
  GlassPillRadius,
  GlassRadius,
  HitTarget,
  Spacing,
} from '@/constants/theme';
import { useGlassTokens, useResolvedScheme } from '@/hooks/use-theme';

function nativeGlassReady(): boolean {
  if (Platform.OS !== 'ios') {
    return false;
  }

  try {
    return isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
  } catch {
    return false;
  }
}

export function useLiquidGlassEnabled() {
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    let alive = true;

    void AccessibilityInfo.isReduceTransparencyEnabled().then((value) => {
      if (alive) {
        setReduceTransparency(value);
      }
    });

    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparency);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  return nativeGlassReady() && !reduceTransparency;
}

type GlassFamilyProps = ViewProps & {
  spacing?: number;
  children: ReactNode;
};

/** One container for sibling glass — matches iOS GlassEffectContainer. */
export function GlassFamily({ spacing = GlassFamilySpacing, style, children, ...rest }: GlassFamilyProps) {
  const enabled = useLiquidGlassEnabled();

  if (enabled) {
    return (
      <GlassContainer spacing={spacing} style={style} {...rest}>
        {children}
      </GlassContainer>
    );
  }

  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
}

type GlassSurfaceProps = ViewProps & {
  children: ReactNode;
  radius?: number;
  interactive?: boolean;
};

export function GlassSurface({
  children,
  style,
  radius = GlassRadius,
  interactive = false,
  ...rest
}: GlassSurfaceProps) {
  const enabled = useLiquidGlassEnabled();
  const scheme = useResolvedScheme();
  const tokens = useGlassTokens();
  const shape = { borderRadius: radius, overflow: 'hidden' as const };

  if (enabled) {
    return (
      <GlassView
        {...rest}
        glassEffectStyle="regular"
        isInteractive={interactive}
        tintColor={tokens.tint}
        colorScheme={scheme}
        style={[shape, style]}>
        {children}
      </GlassView>
    );
  }

  return (
    <View
      {...rest}
      {...webClass('lines-glass')}
      style={[
        shape,
        styles.fallback,
        styles.webBlur,
        { backgroundColor: tokens.fill, borderColor: tokens.stroke },
        style,
      ]}>
      {children}
    </View>
  );
}

type GlassButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  tone?: 'prominent' | 'quiet';
  /** Solid prominent control when already sitting on a GlassSurface. */
  nested?: boolean;
  style?: ViewStyle;
};

export function GlassButton({
  label,
  tone = 'prominent',
  nested = false,
  style,
  disabled,
  ...pressable
}: GlassButtonProps) {
  const enabled = useLiquidGlassEnabled() && !nested;
  const scheme = useResolvedScheme();
  const tokens = useGlassTokens();
  const prominent = tone === 'prominent';
  const labelColor = prominent ? tokens.ctaLabel : undefined;

  const body = enabled ? (
    <GlassView
      glassEffectStyle="regular"
      isInteractive={!disabled}
      tintColor={prominent ? tokens.ctaTint : tokens.tint}
      colorScheme={scheme}
      style={[styles.button, style]}>
      <ThemedText type="smallBold" style={labelColor ? { color: labelColor } : undefined}>
        {label}
      </ThemedText>
    </GlassView>
  ) : (
    <View
      {...webClass(prominent ? 'lines-glass-cta' : 'lines-glass')}
      style={[
        styles.button,
        styles.fallback,
        styles.webBlur,
        {
          backgroundColor: prominent ? tokens.ctaFill : tokens.fill,
          borderColor: tokens.stroke,
        },
        style,
      ]}>
      <ThemedText type="smallBold" style={labelColor ? { color: labelColor } : undefined}>
        {label}
      </ThemedText>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => pressed && !disabled && styles.pressed}
      {...pressable}>
      {body}
    </Pressable>
  );
}

function webClass(className: string): { className?: string } {
  return Platform.OS === 'web' ? { className } : {};
}

const styles = StyleSheet.create({
  fallback: {
    borderWidth: 1,
  },
  webBlur: Platform.select({
    web: {
      backdropFilter: 'blur(28px) saturate(1.6)',
    },
    default: {},
  }) as ViewStyle,
  button: {
    minHeight: HitTarget,
    minWidth: HitTarget,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: GlassPillRadius,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.88,
  },
});
