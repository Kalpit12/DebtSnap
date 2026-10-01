import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface DividerProps {
  style?: ViewStyle;
  inset?: number;
}

export function Divider({ style, inset = 0 }: DividerProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: theme.colors.border,
          marginLeft: inset,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
