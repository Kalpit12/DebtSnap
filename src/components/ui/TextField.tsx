import { TextInput, TextInputProps, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function TextField({
  label,
  error,
  containerStyle,
  style,
  ...props
}: TextFieldProps) {
  const { theme } = useTheme();

  return (
    <View style={[{ marginBottom: theme.spacing.lg }, containerStyle]}>
      {label ? (
        <Text variant="label" color="muted" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={theme.colors.mutedText}
        style={[
          theme.typography.body,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            borderRadius: theme.radii.md,
            color: theme.colors.text,
            height: theme.inputHeight,
            paddingHorizontal: theme.spacing.md,
            borderWidth: StyleSheet.hairlineWidth,
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <Text variant="caption" color="danger" style={{ marginTop: theme.spacing.xs }}>
          {error}
        </Text>
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
});
