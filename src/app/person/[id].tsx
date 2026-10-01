import { useLocalSearchParams, useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { BackHeader } from '@/components/layout/BackHeader';
import {
  BalanceHero,
  Button,
  Card,
  Divider,
  EmptyState,
  MetricCard,
  PersonAvatar,
  Screen,
  SectionHeader,
  StatusBadge,
  Text,
} from '@/components/ui';
import { PressableScale } from '@/components/motion';
import { getCategoryLabel } from '@/constants/categories';
import { STAGGER, TIMING_NORMAL } from '@/constants/motion';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';
import {
  calculatePersonBalance,
  calculatePersonIOwe,
  calculatePersonOwedToMe,
  calculateDebtRemaining,
  getDebtStatus,
} from '@/utils/finance';
import { formatCurrency, formatDate, formatSignedCurrency } from '@/utils/format';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { people, debts, currency } = useAppData();

  const person = people.find((item) => item.id === id);
  const personDebts = useMemo(
    () =>
      debts
        .filter((debt) => debt.personId === id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [debts, id],
  );

  if (!person) {
    return (
      <Screen>
        <BackHeader title="Person" />
        <Text variant="body" color="muted">Person not found.</Text>
      </Screen>
    );
  }

  const owedToMe = calculatePersonOwedToMe(person.id, debts);
  const iOwe = calculatePersonIOwe(person.id, debts);
  const netBalance = calculatePersonBalance(person.id, debts);

  const openAddDebt = () => {
    router.push({ pathname: '/(tabs)/add', params: { personId: person.id } });
  };

  const netLabel =
    netBalance > 0 ? 'They owe you overall' : netBalance < 0 ? 'You owe them overall' : 'All settled';

  return (
    <Screen scroll>
      <BackHeader title={person.name} />

      <Animated.View
        entering={FadeInDown.duration(TIMING_NORMAL.duration!)}
        style={[styles.personHeader, { marginBottom: theme.spacing.md }]}
      >
        <PersonAvatar name={person.name} size="lg" />
        <View style={{ flex: 1 }}>
          <Text variant="h2">{person.name}</Text>
          {person.phone ? (
            <Text variant="bodySmall" color="muted" style={{ marginTop: 2 }}>
              {person.phone}
            </Text>
          ) : null}
        </View>
      </Animated.View>

      <BalanceHero
        label="Net balance"
        amount={netBalance}
        formatAmount={(value) => formatSignedCurrency(value, currency)}
        subtitle={netLabel}
        style={{ marginBottom: theme.spacing.md }}
      />

      <View style={[styles.summaryRow, { gap: theme.spacing.sm, marginBottom: theme.spacing.lg }]}>
        <MetricCard
          label="They owe you"
          amount={owedToMe}
          formatAmount={(value) => formatCurrency(value, currency)}
          delay={STAGGER.md}
        />
        <MetricCard
          label="You owe them"
          amount={iOwe}
          formatAmount={(value) => formatCurrency(value, currency)}
          delay={STAGGER.lg}
        />
      </View>

      <Button
        label="Add debt"
        fullWidth
        onPress={openAddDebt}
        style={{ marginBottom: theme.spacing.xl }}
      />

      <SectionHeader title="Debts" />

      {personDebts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No debts yet"
          description="Debts with this person will appear here."
          actionLabel="Add debt"
          onAction={openAddDebt}
        />
      ) : (
        <Card padded={false}>
          {personDebts.map((debt, index) => {
            const remaining = calculateDebtRemaining(debt);
            const status = getDebtStatus(debt);
            const directionLabel =
              debt.direction === 'THEY_OWE_ME' ? 'They owe you' : 'You owe them';

            return (
              <Animated.View
                key={debt.id}
                entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(index * STAGGER.xs)}
              >
                <PressableScale
                  onPress={() =>
                    router.push({ pathname: '/debt/[id]', params: { id: debt.id } })
                  }
                  style={{ padding: theme.spacing.md }}
                >
                  <View style={styles.debtRowTop}>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" style={{ fontWeight: '600' }}>
                        {formatCurrency(remaining, currency)}
                      </Text>
                      <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                        of {formatCurrency(debt.originalAmount, currency)}
                      </Text>
                    </View>
                    <StatusBadge status={status} />
                  </View>
                  <Text variant="bodySmall" color="muted" style={{ marginTop: 6 }}>
                    {directionLabel} · {getCategoryLabel(debt.category)}
                  </Text>
                  {debt.dueDate ? (
                    <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
                      Due {formatDate(debt.dueDate)}
                    </Text>
                  ) : (
                    <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
                      Created {formatDate(debt.createdAt)}
                    </Text>
                  )}
                </PressableScale>
                {index < personDebts.length - 1 ? <Divider inset={theme.spacing.md} /> : null}
              </Animated.View>
            );
          })}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
  },
  debtRowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
});
