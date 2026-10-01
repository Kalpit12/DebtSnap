import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { STAGGER, TIMING_SLOW } from '@/constants/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

export interface BarChartItem {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface SimpleBarChartProps {
  items: BarChartItem[];
  primaryLabel: string;
  secondaryLabel?: string;
}

function AnimatedBar({
  height,
  color,
  delay,
  borderRadius,
}: {
  height: number;
  color: string;
  delay: number;
  borderRadius: number;
}) {
  const reducedMotion = useReducedMotion();
  const animatedHeight = useSharedValue(reducedMotion ? height : 0);

  useEffect(() => {
    animatedHeight.value = withDelay(delay, withTiming(height, TIMING_SLOW));
  }, [height, delay, animatedHeight, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: color, borderRadius },
        style,
      ]}
    />
  );
}

export function SimpleBarChart({ items, primaryLabel, secondaryLabel }: SimpleBarChartProps) {
  const { theme } = useTheme();
  const maxValue = Math.max(
    1,
    ...items.map((item) => Math.max(item.value, item.secondaryValue ?? 0)),
  );

  return (
    <View>
      <View style={[styles.legend, { marginBottom: theme.spacing.md }]}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
          <Text variant="caption" color="muted">{primaryLabel}</Text>
        </View>
        {secondaryLabel ? (
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
            <Text variant="caption" color="muted">{secondaryLabel}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.chartRow}>
        {items.map((item, index) => {
          const primaryHeight = Math.max((item.value / maxValue) * 72, item.value > 0 ? 4 : 0);
          const secondaryHeight = Math.max(
            ((item.secondaryValue ?? 0) / maxValue) * 72,
            (item.secondaryValue ?? 0) > 0 ? 4 : 0,
          );

          return (
            <View key={item.label} style={styles.barGroup}>
              <View style={styles.bars}>
                <AnimatedBar
                  height={primaryHeight}
                  color={theme.colors.primary}
                  delay={index * STAGGER.xs}
                  borderRadius={theme.radii.sm}
                />
                {secondaryLabel ? (
                  <AnimatedBar
                    height={secondaryHeight}
                    color={theme.colors.accent}
                    delay={index * STAGGER.xs + 40}
                    borderRadius={theme.radii.sm}
                  />
                ) : null}
              </View>
              <Text variant="caption" color="muted" align="center" style={{ marginTop: 6 }}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 96,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 72,
    gap: 4,
  },
  bar: {
    width: 10,
  },
});
