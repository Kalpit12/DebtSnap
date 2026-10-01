import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { PRESS_SCALE, SPRING_SNAPPY } from '@/constants/motion';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const height = theme.buttonHeights[size];
  const isDisabled = disabled || !onPress;

  const backgroundColor =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'secondary'
        ? theme.colors.primaryMuted
        : 'transparent';

  const textColor = variant === 'primary' ? 'inverse' : 'primary';

  const handlePressIn = () => {
    if (isDisabled) return;
    scale.value = withSpring(PRESS_SCALE, SPRING_SNAPPY);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_SNAPPY);
  };

  const handlePress = () => {
    if (isDisabled || !onPress) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.base,
        animatedStyle,
        {
          height,
          backgroundColor,
          borderRadius: theme.radii.md,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: isDisabled ? 0.5 : 1,
        },
        variant === 'ghost' && {
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        variant === 'primary' && {
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.28,
          shadowRadius: 8,
          elevation: 4,
        },
        style,
      ]}
    >
      <Text
        variant={size === 'sm' ? 'label' : 'body'}
        color={textColor}
        style={[
          variant === 'primary' && { color: '#FFFFFF', fontWeight: '600' },
          variant !== 'primary' && { fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
