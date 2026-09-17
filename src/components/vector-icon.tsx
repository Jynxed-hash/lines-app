import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { IconSize } from '@/constants/theme';

export type VectorIconName = Extract<SymbolViewProps['name'], object>;

type VectorIconProps = {
  name: VectorIconName;
  color: ColorValue;
  size?: number;
};

export function VectorIcon({ name, color, size = IconSize.md }: VectorIconProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      importantForAccessibility="no"
      accessibilityElementsHidden
    />
  );
}
