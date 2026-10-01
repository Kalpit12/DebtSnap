import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function IconButton({
  icon: Icon,
  onPress,
  size = 'md',
  variant = 'default',
  disabled = false,
  style,
  accessibilityLabel,
}: IconButtonProps) {
  const { theme } = useTheme();

  const dimension = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const iconSize = theme.iconSizes[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'];

  const handlePress = () => {
    if (disabled || !onPress) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const backgroundColor =
    variant === 'filled'
      ? theme.colors.primaryMuted
      : variant === 'ghost'
        ? 'transparent'
        : theme.colors.surface;

  const iconColor =
    variant === 'filled' ? theme.colors.primary : theme.colors.text;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: theme.radii.md,
          backgroundColor,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        variant === 'default' && {
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <Icon size={iconSize} color={iconColor} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
