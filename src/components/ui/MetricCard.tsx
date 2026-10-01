import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedNumber } from '@/components/motion';
import { STAGGER, TIMING_SLOW } from '@/constants/motion';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface MetricCardProps {
  label: string;
  amount: number;
  formatAmount: (value: number) => string;
  animate?: boolean;
  delay?: number;
  style?: ViewStyle;
}

export function MetricCard({
  label,
  amount,
  formatAmount,
  animate = true,
  delay = STAGGER.md,
  style,
}: MetricCardProps) {
  const { theme } = useTheme();

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.md,
        },
        style,
      ]}
    >
      <Text variant="label" color="muted" style={styles.uppercase}>
        {label}
      </Text>
      {animate ? (
        <AnimatedNumber
          value={amount}
          formatter={formatAmount}
          variant="displaySmall"
          style={{ marginTop: theme.spacing.xs }}
        />
      ) : (
        <Text variant="displaySmall" style={{ marginTop: theme.spacing.xs }}>
          {formatAmount(amount)}
        </Text>
      )}
    </View>
  );

  if (!animate) return content;

  return (
    <Animated.View
      entering={FadeInDown.duration(TIMING_SLOW.duration!).delay(delay)}
      style={{ flex: 1 }}
    >
      {content}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    shadowColor: '#2E225A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
