import { useState } from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SPRING_GENTLE, TIMING_FAST } from '@/constants/motion';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  currencySymbol?: string;
  helperText?: string;
  style?: ViewStyle;
}

export function AmountInput({
  value,
  onChangeText,
  currencySymbol,
  helperText,
  style,
}: AmountInputProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const focusScale = useSharedValue(1);
  const borderOpacity = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
    borderColor: borderOpacity.value > 0.5 ? theme.colors.primary : theme.colors.border,
  }));

  const handleFocus = () => {
    setFocused(true);
    focusScale.value = withSpring(1.01, SPRING_GENTLE);
    borderOpacity.value = withTiming(1, TIMING_FAST);
  };

  const handleBlur = () => {
    setFocused(false);
    focusScale.value = withSpring(1, SPRING_GENTLE);
    borderOpacity.value = withTiming(0, TIMING_FAST);
  };

  return (
    <View style={style}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.lg,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            marginBottom: helperText ? theme.spacing.xs : theme.spacing.lg,
          },
          containerStyle,
        ]}
      >
        {currencySymbol ? (
          <Text
            variant="h3"
            color={focused ? 'primary' : 'muted'}
            style={{ marginRight: theme.spacing.sm }}
          >
            {currencySymbol}
          </Text>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="0"
          keyboardType="decimal-pad"
          placeholderTextColor={theme.colors.mutedText}
          style={[
            theme.typography.display,
            styles.input,
            { color: theme.colors.text },
          ]}
          accessibilityLabel="Amount"
        />
      </Animated.View>
      {helperText ? (
        <Text variant="caption" color="muted" style={{ marginBottom: theme.spacing.lg }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    padding: 0,
  },
});
