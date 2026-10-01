import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { TIMING_SLOW } from '@/constants/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color, height = 6 }: ProgressBarProps) {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, progress));
  const width = useSharedValue(reducedMotion ? clamped : 0);

  useEffect(() => {
    width.value = withTiming(clamped, TIMING_SLOW);
  }, [clamped, width, reducedMotion]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: theme.colors.border,
          borderRadius: theme.radii.pill,
          height,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color ?? theme.colors.primary,
            borderRadius: theme.radii.pill,
            height,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {},
});
