import { Easing, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

export const MOTION = {
  fast: 180,
  normal: 280,
  slow: 420,
  number: 900,
} as const;

export const TIMING_FAST: WithTimingConfig = {
  duration: MOTION.fast,
  easing: Easing.out(Easing.cubic),
};

export const TIMING_NORMAL: WithTimingConfig = {
  duration: MOTION.normal,
  easing: Easing.out(Easing.cubic),
};

export const TIMING_SLOW: WithTimingConfig = {
  duration: MOTION.slow,
  easing: Easing.out(Easing.cubic),
};

export const TIMING_NUMBER: WithTimingConfig = {
  duration: MOTION.number,
  easing: Easing.out(Easing.cubic),
};

export const SPRING_SNAPPY: WithSpringConfig = {
  damping: 18,
  stiffness: 280,
  mass: 0.8,
};

export const SPRING_GENTLE: WithSpringConfig = {
  damping: 22,
  stiffness: 200,
  mass: 1,
};

export const PRESS_SCALE = 0.97;

export const STAGGER = {
  xs: 40,
  sm: 60,
  md: 80,
  lg: 100,
} as const;
