import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SectionHeader({ title, subtitle, style }: SectionHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: theme.spacing.sm }, style]}>
      <Text variant="label" color="muted" style={styles.uppercase}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="caption" color="muted" style={{ marginTop: theme.spacing.xs }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
