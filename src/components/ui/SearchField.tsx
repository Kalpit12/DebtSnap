import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { TIMING_FAST } from '@/constants/motion';
import { useTheme } from '@/hooks/useTheme';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search',
  style,
}: SearchFieldProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: focusProgress.value > 0.5 ? theme.colors.primary : theme.colors.border,
    transform: [{ scale: 1 + focusProgress.value * 0.008 }],
  }));

  const handleFocus = () => {
    setFocused(true);
    focusProgress.value = withTiming(1, TIMING_FAST);
  };

  const handleBlur = () => {
    setFocused(false);
    focusProgress.value = withTiming(0, TIMING_FAST);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
        },
        animatedStyle,
        style,
      ]}
    >
      <Search
        size={theme.iconSizes.md}
        color={focused ? theme.colors.primary : theme.colors.mutedText}
        strokeWidth={2}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.mutedText}
        style={[theme.typography.body, styles.input, { color: theme.colors.text }]}
        accessibilityLabel={placeholder}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 0,
  },
});
