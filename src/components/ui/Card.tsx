import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export type CardLevel = 'flat' | 'elevated' | 'hero';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  level?: CardLevel;
}

export function Card({ children, style, padded = true, level = 'elevated' }: CardProps) {
  const { theme } = useTheme();

  const surfaceColor =
    level === 'flat' ? theme.colors.surfaceSubtle : theme.colors.surfaceElevated;

  const shadowStyle =
    level === 'hero'
      ? {
          shadowColor: theme.isDark ? '#000000' : theme.colors.primaryDark,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: theme.isDark ? 0.35 : 0.1,
          shadowRadius: 16,
          elevation: 4,
        }
      : level === 'elevated'
        ? {
            shadowColor: theme.isDark ? '#000000' : theme.colors.primaryDark,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme.isDark ? 0.2 : 0.06,
            shadowRadius: 12,
            elevation: 2,
          }
        : {};

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: surfaceColor,
          borderRadius: level === 'hero' ? theme.radii.xl : theme.radii.lg,
          padding: padded ? theme.spacing.md : 0,
          borderColor: theme.isDark ? theme.colors.border : theme.colors.border,
        },
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
