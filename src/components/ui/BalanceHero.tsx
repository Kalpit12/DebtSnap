import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedNumber } from '@/components/motion';
import { STAGGER, TIMING_SLOW } from '@/constants/motion';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface BalanceHeroProps {
  label: string;
  amount: number;
  formatAmount: (value: number) => string;
  subtitle?: string;
  style?: ViewStyle;
}

export function BalanceHero({
  label,
  amount,
  formatAmount,
  subtitle,
  style,
}: BalanceHeroProps) {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(TIMING_SLOW.duration!).delay(STAGGER.sm)}
      style={[styles.wrapper, style]}
    >
      <View
        style={[
          styles.glow,
          {
            backgroundColor: theme.colors.heroGlow,
            borderRadius: theme.radii.xl,
          },
        ]}
      />
      <LinearGradient
        colors={[
          theme.colors.heroGradientStart,
          theme.colors.heroGradientMid,
          theme.colors.heroGradientEnd,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            borderRadius: theme.radii.xl,
            padding: theme.spacing.lg,
          },
        ]}
      >
        <Text
          variant="label"
          style={[styles.uppercase, { color: theme.colors.onHeroMuted }]}
        >
          {label}
        </Text>
        <AnimatedNumber
          value={amount}
          formatter={formatAmount}
          variant="display"
          color={theme.colors.onHero}
          style={{ marginTop: theme.spacing.sm }}
        />
        {subtitle ? (
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onHeroMuted, marginTop: theme.spacing.xs }}
          >
            {subtitle}
          </Text>
        ) : null}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    bottom: -4,
    opacity: 0.55,
  },
  gradient: {
    overflow: 'hidden',
    shadowColor: '#2E225A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
