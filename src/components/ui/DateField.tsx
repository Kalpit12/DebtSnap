import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { formatDate, toISODate } from '@/utils/format';
import { useTheme } from '@/hooks/useTheme';

import { Button } from './Button';
import { Text } from './Text';

interface DateFieldProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  optional?: boolean;
}

export function DateField({ label, value, onChange, optional = false }: DateFieldProps) {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const dateValue = value ? new Date(value) : new Date();

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'dismissed') {
        return;
      }
    }
    if (selected) {
      onChange(toISODate(selected));
    }
  };

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text variant="label" color="muted" style={styles.label}>
        {label}
      </Text>
      <Pressable
        onPress={() => setShowPicker(true)}
        style={({ pressed }) => [
          styles.field,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.md,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Calendar size={18} color={theme.colors.mutedText} strokeWidth={2} />
        <Text variant="body" color={value ? 'primary' : 'muted'} style={{ flex: 1 }}>
          {value ? formatDate(value) : optional ? 'Not set' : 'Select date'}
        </Text>
        {optional && value ? (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onChange(undefined);
            }}
            hitSlop={8}
          >
            <Text variant="caption" color="accent">Clear</Text>
          </Pressable>
        ) : null}
      </Pressable>

      {showPicker && Platform.OS === 'ios' ? (
        <View
          style={[
            styles.iosPicker,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.md,
            },
          ]}
        >
          <DateTimePicker
            value={dateValue}
            mode="date"
            display="spinner"
            onChange={handleChange}
            themeVariant={theme.isDark ? 'dark' : 'light'}
          />
          <Button label="Done" onPress={() => setShowPicker(false)} fullWidth />
        </View>
      ) : null}

      {showPicker && Platform.OS === 'android' ? (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  field: {
    minHeight: 52,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iosPicker: {
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 8,
  },
});
