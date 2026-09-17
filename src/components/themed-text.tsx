import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'hero' | 'small' | 'smallBold' | 'subtitle' | 'eyebrow' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'hero' && styles.hero,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'eyebrow' && styles.eyebrow,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 500,
  },
  smallBold: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 700,
  },
  default: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  eyebrow: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 600,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 48,
    fontWeight: 400,
    lineHeight: 52,
  },
  hero: {
    fontFamily: Fonts.display,
    fontSize: 80,
    fontWeight: 400,
    lineHeight: 84,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 400,
  },
  link: {
    fontFamily: Fonts.sans,
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    fontFamily: Fonts.sans,
    lineHeight: 30,
    fontSize: 14,
    color: '#2563EB',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
