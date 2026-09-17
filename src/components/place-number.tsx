import { Platform, StyleSheet, Text, type TextStyle } from 'react-native';

import { Fonts, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Tone = 'default' | 'close' | 'now';
type Size = 'hero' | 'card' | 'row';

export function PlaceNumber({
  value,
  tone = 'default',
  size = 'hero',
}: {
  value: string | number;
  tone?: Tone;
  size?: Size;
}) {
  const theme = useTheme();
  const color = tone === 'now' ? theme.called : tone === 'close' ? theme.accent : theme.text;
  const sizeStyle: TextStyle =
    size === 'hero' ? Type.position : size === 'card' ? Type.wait : { fontSize: 28, lineHeight: 28, fontWeight: '800' as const };

  return (
    <Text
      accessibilityRole="text"
      style={[
        styles.base,
        sizeStyle,
        { color },
      ]}>
      {value}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: Fonts.number,
    fontWeight: '800',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
});
