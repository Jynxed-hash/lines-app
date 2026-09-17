import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code'
    | 'kicker'
    | 'venue'
    | 'wait';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color = themeColor ? theme[themeColor] : type === 'linkPrimary' ? theme.accent : theme.text;

  return (
    <Text
      style={[
        { color, fontFamily: Fonts.sans },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        type === 'kicker' && styles.kicker,
        type === 'venue' && styles.venue,
        type === 'wait' && styles.wait,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    ...Type.label,
    fontFamily: Fonts.sans,
    fontWeight: '400',
  },
  smallBold: {
    ...Type.label,
    fontFamily: Fonts.sansSemiBold,
  },
  default: {
    ...Type.body,
    fontFamily: Fonts.sans,
  },
  title: {
    ...Type.screenTitle,
    fontFamily: Fonts.serif,
  },
  subtitle: {
    ...Type.screenTitle,
    fontFamily: Fonts.serif,
  },
  link: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.sansSemiBold,
  },
  linkPrimary: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.sansSemiBold,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: '700' }) ?? '500',
    fontSize: 13,
    letterSpacing: 0.6,
  },
  kicker: {
    ...Type.kicker,
    fontFamily: Fonts.sansSemiBold,
    textTransform: 'uppercase',
  },
  venue: {
    ...Type.venue,
    fontFamily: Fonts.sansSemiBold,
  },
  wait: {
    ...Type.wait,
    fontFamily: Fonts.number,
  },
});
