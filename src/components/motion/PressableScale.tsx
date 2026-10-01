import * as Haptics from 'expo-haptics';
import { ReactNode } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { PRESS_SCALE, SPRING_SNAPPY } from '@/constants/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: boolean;
  accessibilityLabel?: string;
}

export function PressableScale({
  children,
  onPress,
  disabled = false,
  style,
  scaleTo = PRESS_SCALE,
  haptic = false,
  accessibilityLabel,
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(scaleTo, SPRING_SNAPPY);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_SNAPPY);
  };

  const handlePress = () => {
    if (disabled || !onPress) return;
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[animatedStyle, style, disabled && { opacity: 0.5 }]}
    >
      {children}
    </AnimatedPressable>
  );
}
