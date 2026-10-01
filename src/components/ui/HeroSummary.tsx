import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface HeroSummaryProps {
  label: string;
  amount: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function HeroSummary({ label, amount, subtitle, style }: HeroSummaryProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.lg,
        },
        style,
      ]}
    >
      <Text variant="label" color="muted" style={styles.uppercase}>
        {label}
      </Text>
      <Text variant="display" style={{ marginTop: theme.spacing.sm }}>
        {amount}
      </Text>
      {subtitle ? (
        <Text variant="bodySmall" color="muted" style={{ marginTop: theme.spacing.xs }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
