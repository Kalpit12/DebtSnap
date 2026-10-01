import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import { TypographyVariant } from '@/constants/theme/typography';
import { useTheme } from '@/hooks/useTheme';

type TextColor = 'primary' | 'muted' | 'inverse' | 'success' | 'warning' | 'danger' | 'accent';

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
}

const colorMap = {
  primary: 'text',
  muted: 'mutedText',
  inverse: 'surface',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  accent: 'accent',
} as const;

export function Text({
  variant = 'body',
  color = 'primary',
  align = 'left',
  style,
  ...props
}: TextProps) {
  const { theme } = useTheme();
  const colorKey = colorMap[color];

  return (
    <RNText
      style={[
        theme.typography[variant],
        {
          color: theme.colors[colorKey],
          textAlign: align,
        },
        style,
      ]}
      {...props}
    />
  );
}
