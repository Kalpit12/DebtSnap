import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { DueUrgency } from '@/utils/insights';

import { Text } from './Text';

const LABELS: Record<DueUrgency, string> = {
  overdue: 'Overdue',
  soon: 'Due soon',
  upcoming: 'Upcoming',
};

interface DueStatusLabelProps {
  urgency: DueUrgency;
}

export function DueStatusLabel({ urgency }: DueStatusLabelProps) {
  const { theme } = useTheme();

  const colors = {
    overdue: { bg: 'rgba(214, 69, 69, 0.12)', text: theme.colors.danger },
    soon: { bg: 'rgba(217, 154, 34, 0.12)', text: theme.colors.warning },
    upcoming: { bg: theme.colors.primaryMuted, text: theme.colors.primary },
  }[urgency];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderRadius: theme.radii.pill,
        },
      ]}
    >
      <Text variant="caption" style={{ color: colors.text, fontWeight: '600' }}>
        {LABELS[urgency]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
