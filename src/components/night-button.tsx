import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'primary' | 'ghost' | 'danger';

type NightButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

export function NightButton({ label, variant = 'primary', style, disabled, ...rest }: NightButtonProps) {
  const theme = useTheme();
  const backgroundColor =
    variant === 'primary' ? theme.accent : variant === 'ghost' ? 'transparent' : 'transparent';
  const borderColor = variant === 'ghost' ? theme.hairline : 'transparent';
  const color = variant === 'primary' ? theme.onAccent : variant === 'danger' ? theme.danger : theme.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        },
        style,
      ]}
      {...rest}>
      <ThemedText type="smallBold" style={{ color }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
});
