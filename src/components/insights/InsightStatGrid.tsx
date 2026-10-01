import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

interface InsightStat {
  label: string;
  value: string;
}

interface InsightStatGridProps {
  stats: InsightStat[];
}

export function InsightStatGrid({ stats }: InsightStatGridProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.grid, { gap: theme.spacing.sm }]}>
      {stats.map((stat) => (
        <Card key={stat.label} style={styles.item}>
          <Text variant="label" color="muted" style={styles.uppercase}>
            {stat.label}
          </Text>
          <Text variant="h3" style={{ marginTop: theme.spacing.xs }}>
            {stat.value}
          </Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '48%',
    flexGrow: 1,
  },
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
