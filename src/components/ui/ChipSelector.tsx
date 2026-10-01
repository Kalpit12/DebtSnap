import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipSelectorProps<T extends string> {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ChipSelector<T extends string>({
  options,
  value,
  onChange,
}: ChipSelectorProps<T>) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: theme.spacing.sm, paddingBottom: theme.spacing.lg }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
                borderColor: selected ? theme.colors.primary : theme.colors.border,
                borderRadius: theme.radii.pill,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text
              variant="label"
              style={{
                color: selected ? '#FFFFFF' : theme.colors.text,
                fontWeight: selected ? '600' : '500',
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
