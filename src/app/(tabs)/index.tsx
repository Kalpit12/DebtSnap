import { useRouter } from 'expo-router';
import { Clock, Wallet } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/components/motion';
import {
  ActivityRow,
  BalanceHero,
  Button,
  Card,
  Divider,
  DueStatusLabel,
  EmptyState,
  MetricCard,
  Screen,
  SectionHeader,
  Text,
} from '@/components/ui';
import { STAGGER, TIMING_NORMAL, TIMING_SLOW } from '@/constants/motion';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';
import { buildRecentActivity } from '@/utils/activity';
import { formatCurrency, formatDate, formatSignedCurrency } from '@/utils/format';
import {
  calculateDashboardTotals,
  calculateDebtRemaining,
  getUnpaidDebtsWithDueDate,
} from '@/utils/finance';
import { countOwedToMeDebts, getDueUrgency } from '@/utils/insights';
import { getGreeting } from '@/utils/greeting';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { debts, people, payments, currency } = useAppData();

  const totals = calculateDashboardTotals(debts);
  const dueSoon = getUnpaidDebtsWithDueDate(debts).slice(0, 5);
  const activity = buildRecentActivity(debts, payments, people, currency);
  const hasDebts = debts.length > 0;
  const activeOwedCount = countOwedToMeDebts(debts);

  const personMap = new Map(people.map((person) => [person.id, person.name]));
  const openAddDebt = () => router.push('/(tabs)/add');

  return (
    <Screen scroll tabBarClearance>
      <Animated.View
        entering={FadeInDown.duration(TIMING_NORMAL.duration!)}
        style={[styles.header, { marginBottom: theme.spacing.lg }]}
      >
        <Text variant="h2">{getGreeting()}</Text>
        <Text variant="body" color="muted" style={{ marginTop: theme.spacing.xs }}>
          Your money snapshot
        </Text>
      </Animated.View>

      {!hasDebts ? (
        <EmptyState
          icon={Wallet}
          title="No money to chase yet"
          description="Add your first debt and DebtSnap will keep track of it."
          actionLabel="Add debt"
          onAction={openAddDebt}
        />
      ) : (
        <>
          <BalanceHero
            label="You're owed"
            amount={totals.owedToMe}
            formatAmount={(value) => formatCurrency(value, currency)}
            subtitle={
              activeOwedCount > 0
                ? `${activeOwedCount} active ${activeOwedCount === 1 ? 'debt' : 'debts'}`
                : 'No active debts owed to you'
            }
            style={{ marginBottom: theme.spacing.md }}
          />

          <View style={[styles.summaryRow, { gap: theme.spacing.sm, marginBottom: theme.spacing.xl }]}>
            <MetricCard
              label="You owe"
              amount={totals.iOwe}
              formatAmount={(value) => formatCurrency(value, currency)}
              delay={STAGGER.md}
            />
            <MetricCard
              label="Net balance"
              amount={totals.netBalance}
              formatAmount={(value) => formatSignedCurrency(value, currency)}
              delay={STAGGER.lg}
            />
          </View>

          <Animated.View entering={FadeInDown.duration(TIMING_SLOW.duration!).delay(STAGGER.lg)}>
            <SectionHeader title="Due soon" />
            {dueSoon.length === 0 ? (
              <Card level="flat" style={{ marginBottom: theme.spacing.xl }}>
                <View style={styles.inlineEmpty}>
                  <Clock size={18} color={theme.colors.mutedText} strokeWidth={2} />
                  <Text variant="bodySmall" color="muted">No upcoming due dates</Text>
                </View>
              </Card>
            ) : (
              <Card padded={false} style={{ marginBottom: theme.spacing.xl }}>
                {dueSoon.map((debt, index) => {
                  const urgency = getDueUrgency(debt);
                  const name = personMap.get(debt.personId) ?? 'Someone';
                  const remaining = calculateDebtRemaining(debt);

                  return (
                    <Animated.View
                      key={debt.id}
                      entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(
                        STAGGER.lg + index * STAGGER.xs,
                      )}
                    >
                      <PressableScale
                        onPress={() =>
                          router.push({ pathname: '/debt/[id]', params: { id: debt.id } })
                        }
                        style={{ padding: theme.spacing.md }}
                      >
                        <View style={styles.dueRowTop}>
                          <Text variant="body" style={{ fontWeight: '600' }}>{name}</Text>
                          <Text variant="body" style={{ fontWeight: '600' }}>
                            {formatCurrency(remaining, currency)}
                          </Text>
                        </View>
                        <View style={[styles.dueRowBottom, { marginTop: 6 }]}>
                          <Text variant="caption" color="muted">
                            Due {formatDate(debt.dueDate!)}
                          </Text>
                          {urgency ? <DueStatusLabel urgency={urgency} /> : null}
                        </View>
                      </PressableScale>
                      {index < dueSoon.length - 1 ? <Divider inset={theme.spacing.md} /> : null}
                    </Animated.View>
                  );
                })}
              </Card>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(TIMING_SLOW.duration!).delay(STAGGER.lg + 40)}>
            <SectionHeader title="Recent activity" />
            <Card padded={false} style={{ marginBottom: theme.spacing.xl }}>
              {activity.length === 0 ? (
                <View style={[styles.inlineEmpty, { padding: theme.spacing.md }]}>
                  <Text variant="bodySmall" color="muted">No activity yet</Text>
                </View>
              ) : (
                activity.map((item, index) => (
                  <View key={item.id}>
                    <ActivityRow
                      icon={item.icon}
                      title={item.label}
                      subtitle={formatDate(item.date)}
                      amount={item.amount}
                      onPress={() =>
                        router.push({ pathname: '/debt/[id]', params: { id: item.debtId } })
                      }
                      style={{ paddingHorizontal: theme.spacing.md }}
                    />
                    {index < activity.length - 1 ? <Divider inset={theme.spacing.md} /> : null}
                  </View>
                ))
              )}
            </Card>
          </Animated.View>

          <Button label="Add debt" variant="secondary" fullWidth onPress={openAddDebt} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
  },
  inlineEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  dueRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
