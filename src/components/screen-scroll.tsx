import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ScreenScroll({
  children,
  contentStyle,
  compact = false,
}: {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  compact?: boolean;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const stackGap = compact ? Spacing.three : Spacing.four;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
        },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled">
      <ThemedView style={[styles.page, { gap: stackGap }]}>{children}</ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingHorizontal: Spacing.four },
  page: { width: '100%', maxWidth: MaxContentWidth },
});
