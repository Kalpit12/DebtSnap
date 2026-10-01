import { useEffect, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { TIMING_NUMBER } from '@/constants/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';

import { Text } from '../ui/Text';

interface AnimatedNumberProps {
  value: number;
  formatter: (value: number) => string;
  variant?: 'display' | 'displaySmall' | 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall';
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function AnimatedNumber({
  value,
  formatter,
  variant = 'display',
  color,
  style,
}: AnimatedNumberProps) {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const animatedValue = useSharedValue(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (reducedMotion) {
      animatedValue.value = value;
      setDisplayValue(value);
      return;
    }
    animatedValue.value = withTiming(value, TIMING_NUMBER);
  }, [value, reducedMotion, animatedValue]);

  useAnimatedReaction(
    () => animatedValue.value,
    (current) => {
      runOnJS(setDisplayValue)(Math.round(current));
    },
    [animatedValue],
  );

  if (color) {
    return (
      <Animated.Text
        style={[
          theme.typography[variant],
          { color },
          style,
        ]}
      >
        {formatter(displayValue)}
      </Animated.Text>
    );
  }

  return (
    <Text variant={variant} style={style}>
      {formatter(displayValue)}
    </Text>
  );
}
