import { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { STAGGER, TIMING_NORMAL, TIMING_SLOW } from '@/constants/motion';
import { useTheme } from '@/hooks/useTheme';

import { Button } from './Button';
import { Text } from './Text';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(TIMING_SLOW.duration!)}
      style={[styles.container, style]}
    >
      <Animated.View
        entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(STAGGER.sm)}
        style={[
          styles.iconWrap,
          {
            backgroundColor: theme.colors.primaryMuted,
            borderRadius: theme.radii.xl,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Icon size={theme.iconSizes.xl} color={theme.colors.primary} strokeWidth={1.75} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(STAGGER.md)}>
        <Text variant="h3" align="center" style={{ marginTop: theme.spacing.lg }}>
          {title}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(STAGGER.lg)}>
        <Text
          variant="bodySmall"
          color="muted"
          align="center"
          style={{ marginTop: theme.spacing.sm, maxWidth: 280 }}
        >
          {description}
        </Text>
      </Animated.View>

      {actionLabel && onAction ? (
        <Animated.View entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(STAGGER.lg + 40)}>
          <Button
            label={actionLabel}
            onPress={onAction}
            style={{ marginTop: theme.spacing.lg }}
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  iconWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
