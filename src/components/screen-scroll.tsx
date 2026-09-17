import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing, TopChromeInset } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenScrollProps = {
  children: ReactNode;
} & Pick<ScrollViewProps, 'keyboardShouldPersistTaps'>;

export function ScreenScroll({ children, keyboardShouldPersistTaps }: ScreenScrollProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + TopChromeInset + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
        },
      ]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
      <View style={styles.page}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { alignItems: 'center', paddingHorizontal: Spacing.three },
  page: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.three },
});
