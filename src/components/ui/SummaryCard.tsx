import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface SummaryCardProps {
  label: string;
  amount: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SummaryCard({ label, amount, subtitle, style }: SummaryCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.md,
        },
        style,
      ]}
    >
      <Text variant="label" color="muted" style={styles.label}>
        {label}
      </Text>
      <Text variant="displaySmall" style={{ marginTop: theme.spacing.xs }}>
        {amount}
      </Text>
      {subtitle ? (
        <Text variant="caption" color="muted" style={{ marginTop: theme.spacing.xs }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
