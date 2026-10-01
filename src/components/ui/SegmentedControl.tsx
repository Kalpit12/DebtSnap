import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { PressableScale } from '@/components/motion';
import { TIMING_FAST } from '@/constants/motion';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: theme.colors.surfaceSubtle,
          borderRadius: theme.radii.md,
          borderColor: theme.colors.border,
          marginBottom: theme.spacing.lg,
          gap: 4,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <PressableScale
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              {
                borderRadius: theme.radii.md - 2,
                backgroundColor: selected ? theme.colors.primary : 'transparent',
              },
            ]}
            haptic
          >
            {selected ? (
              <Animated.View entering={FadeIn.duration(TIMING_FAST.duration!)}>
                <Text variant="bodySmall" style={styles.selectedLabel}>
                  {option.label}
                </Text>
              </Animated.View>
            ) : (
              <Text variant="bodySmall" color="muted" style={styles.label}>
                {option.label}
              </Text>
            )}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  selectedLabel: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  label: {
    fontWeight: '500',
  },
});
