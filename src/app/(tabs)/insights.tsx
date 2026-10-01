import { ChartNoAxesCombined } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { InsightStatGrid } from '@/components/insights/InsightStatGrid';
import { SimpleBarChart } from '@/components/insights/SimpleBarChart';
import { AnimatedNumber } from '@/components/motion';
import {
  BalanceHero,
  Card,
  EmptyState,
  MetricCard,
  ProgressBar,
  Screen,
  SectionHeader,
  Text,
} from '@/components/ui';
import { getCategoryLabel } from '@/constants/categories';
import { STAGGER, TIMING_NORMAL, TIMING_SLOW } from '@/constants/motion';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, formatPercent } from '@/utils/format';
import {
  calculateCategoryBreakdown,
  calculateCollectionSummary,
  calculateDebtHealth,
  calculateInsightsOverview,
  calculateMonthlyActivity,
} from '@/utils/insights';

export default function InsightsScreen() {
  const { theme } = useTheme();
  const { debts, payments, currency, isLoading } = useAppData();

  const overview = useMemo(() => calculateInsightsOverview(debts), [debts]);
  const collection = useMemo(() => calculateCollectionSummary(debts), [debts]);
  const monthlyActivity = useMemo(
    () => calculateMonthlyActivity(debts, payments),
    [debts, payments],
  );
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(debts), [debts]);
  const debtHealth = useMemo(() => calculateDebtHealth(debts), [debts]);

  const hasData = debts.length > 0;
  const hasMonthlyActivity = monthlyActivity.some(
    (item) => item.debtsCreated > 0 || item.paymentsRecorded > 0,
  );
  const maxCategoryAmount = categoryBreakdown[0]?.amount ?? 1;

  if (isLoading) {
    return (
      <Screen tabBarClearance>
        <View style={styles.header}>
          <Text variant="h1">Insights</Text>
        </View>
        <Text variant="body" color="muted">Loading insights...</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll tabBarClearance>
      <Animated.View
        entering={FadeInDown.duration(TIMING_NORMAL.duration!)}
        style={[styles.header, { marginBottom: theme.spacing.xl }]}
      >
        <Text variant="h1">Insights</Text>
        <Text variant="body" color="muted" style={{ marginTop: theme.spacing.xs }}>
          Your financial patterns
        </Text>
      </Animated.View>

      {!hasData ? (
        <EmptyState
          icon={ChartNoAxesCombined}
          title="Your insights are building"
          description="Track a few debts and payments to see patterns here."
        />
      ) : (
        <>
          <BalanceHero
            label="Outstanding"
            amount={overview.totalOutstanding}
            formatAmount={(value) => formatCurrency(value, currency)}
            subtitle={`${overview.activeDebts} active · ${overview.overdueDebts} overdue`}
            style={{ marginBottom: theme.spacing.md }}
          />

          <View style={[styles.metricsRow, { gap: theme.spacing.sm, marginBottom: theme.spacing.xl }]}>
            <MetricCard
              label="Collected"
              amount={overview.totalCollected}
              formatAmount={(value) => formatCurrency(value, currency)}
              delay={STAGGER.md}
            />
            <MetricCard
              label="You owe"
              amount={overview.totalYouOwe}
              formatAmount={(value) => formatCurrency(value, currency)}
              delay={STAGGER.lg}
            />
          </View>

          {collection.originallyOwed > 0 ? (
            <Animated.View entering={FadeInDown.duration(TIMING_SLOW.duration!).delay(STAGGER.lg)}>
              <SectionHeader title="Collection summary" />
              <Card level="elevated" style={{ marginBottom: theme.spacing.xl }}>
                <Text variant="bodySmall" color="muted">
                  {formatCurrency(collection.originallyOwed, currency)} originally owed
                </Text>
                <AnimatedNumber
                  value={collection.collected}
                  formatter={(value) => formatCurrency(value, currency)}
                  variant="h2"
                  style={{ marginTop: theme.spacing.sm }}
                />
                <Text variant="bodySmall" color="muted" style={{ marginTop: theme.spacing.xs }}>
                  {formatCurrency(collection.outstanding, currency)} outstanding
                </Text>
                <View style={{ marginTop: theme.spacing.md }}>
                  <View style={styles.rowBetween}>
                    <Text variant="label" color="muted">Collection rate</Text>
                    <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                      {formatPercent(collection.collectionPercent)}
                    </Text>
                  </View>
                  <ProgressBar progress={collection.collectionPercent} />
                </View>
              </Card>
            </Animated.View>
          ) : null}

          {hasMonthlyActivity ? (
            <Animated.View entering={FadeInDown.duration(TIMING_SLOW.duration!).delay(STAGGER.lg + 40)}>
              <SectionHeader title="Monthly activity" />
              <Card style={{ marginBottom: theme.spacing.xl }}>
                <SimpleBarChart
                  items={monthlyActivity.map((item) => ({
                    label: item.label,
                    value: item.debtsCreated,
                    secondaryValue: item.paymentsRecorded,
                  }))}
                  primaryLabel="Debts created"
                  secondaryLabel="Payments"
                />
              </Card>
            </Animated.View>
          ) : null}

          {categoryBreakdown.length > 0 ? (
            <Animated.View entering={FadeInDown.duration(TIMING_SLOW.duration!).delay(STAGGER.lg + 80)}>
              <SectionHeader title="By category" />
              <Card style={{ marginBottom: theme.spacing.xl }}>
                {categoryBreakdown.map((item, index) => (
                  <Animated.View
                    key={item.category}
                    entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(
                      index * STAGGER.xs,
                    )}
                    style={index < categoryBreakdown.length - 1 ? { marginBottom: theme.spacing.md } : undefined}
                  >
                    <View style={styles.rowBetween}>
                      <Text variant="bodySmall">{getCategoryLabel(item.category)}</Text>
                      <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                        {formatCurrency(item.amount, currency)}
                      </Text>
                    </View>
                    <ProgressBar
                      progress={(item.amount / maxCategoryAmount) * 100}
                      height={4}
                    />
                  </Animated.View>
                ))}
              </Card>
            </Animated.View>
          ) : null}

          <SectionHeader title="Debt health" />
          <Card>
            <HealthRow label="Active debts" value={debtHealth.active} color="primary" />
            <HealthRow label="Overdue debts" value={debtHealth.overdue} color="danger" />
            <HealthRow label="Partially paid" value={debtHealth.partiallyPaid} color="warning" />
            <HealthRow label="Paid debts" value={debtHealth.paid} color="success" />
          </Card>

          <InsightStatGrid
            stats={[
              { label: 'Paid debts', value: String(overview.paidDebts) },
              { label: 'Active debts', value: String(overview.activeDebts) },
            ]}
          />
        </>
      )}
    </Screen>
  );
}

function HealthRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'primary' | 'success' | 'warning' | 'danger';
}) {
  const { theme } = useTheme();

  const dotColor = {
    primary: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
  }[color];

  return (
    <View style={[styles.healthRow, { marginBottom: theme.spacing.sm }]}>
      <View style={styles.healthLeft}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <Text variant="bodySmall">{label}</Text>
      </View>
      <Text variant="bodySmall" style={{ fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
  },
  metricsRow: {
    flexDirection: 'row',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  healthLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
