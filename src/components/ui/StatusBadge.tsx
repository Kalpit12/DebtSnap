import { StyleSheet, View } from 'react-native';

import type { DebtStatus } from '@/types/debt';
import { DEBT_STATUS_LABELS } from '@/constants/status';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface StatusBadgeProps {
  status: DebtStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();

  const colors = {
    ACTIVE: { bg: theme.colors.primaryMuted, text: theme.colors.primary },
    PARTIALLY_PAID: { bg: 'rgba(217, 154, 34, 0.15)', text: theme.colors.warning },
    PAID: { bg: 'rgba(34, 160, 107, 0.15)', text: theme.colors.success },
    OVERDUE: { bg: 'rgba(214, 69, 69, 0.15)', text: theme.colors.danger },
  }[status];

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
        {DEBT_STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
