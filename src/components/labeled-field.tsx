import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, Touch } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type LabeledFieldProps = TextInputProps & {
  label: string;
  hint?: string;
  error?: string | null;
};

export function LabeledField({ label, hint, error, style, ...inputProps }: LabeledFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <ThemedText type="smallBold">{label}</ThemedText>
      {hint ? (
        <ThemedText type="small" themeColor="textSecondary">
          {hint}
        </ThemedText>
      ) : null}
      <TextInput
        {...inputProps}
        accessibilityLabel={label}
        accessibilityHint={hint}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: error ? theme.danger : theme.border,
            backgroundColor: theme.background,
          },
          style,
        ]}
      />
      {error ? (
        <ThemedText type="small" style={{ color: theme.danger }} accessibilityLiveRegion="polite">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.one,
  },
  input: {
    minHeight: Touch.min,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    lineHeight: 24,
  },
});
