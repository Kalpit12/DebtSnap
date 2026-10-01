import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

import { BackHeader } from '@/components/layout/BackHeader';
import { AnimatedNumber } from '@/components/motion';
import {
  Button,
  Card,
  Divider,
  ProgressBar,
  Screen,
  SectionHeader,
  StatusBadge,
  Text,
} from '@/components/ui';
import { getCategoryLabel } from '@/constants/categories';
import { STAGGER, TIMING_NORMAL, TIMING_SLOW } from '@/constants/motion';
import { getPaymentMethodLabel } from '@/constants/payments';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';
import {
  calculateDebtRemaining,
  getDebtProgress,
  getDebtStatus,
} from '@/utils/finance';
import { formatCurrency, formatDate, formatPercent } from '@/utils/format';

export default function DebtDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { debts, people, currency, deleteDebt, getPaymentsForDebt } = useAppData();
  const [deleting, setDeleting] = useState(false);

  const debt = debts.find((item) => item.id === id);
  const person = useMemo(
    () => people.find((item) => item.id === debt?.personId),
    [people, debt?.personId],
  );
  const payments = debt ? getPaymentsForDebt(debt.id) : [];

  if (!debt) {
    return (
      <Screen>
        <BackHeader title="Debt" />
        <Text variant="body" color="muted">Debt not found.</Text>
      </Screen>
    );
  }

  const remaining = calculateDebtRemaining(debt);
  const status = getDebtStatus(debt);
  const progress = getDebtProgress(debt);
  const isPaid = remaining === 0;
  const directionLabel = debt.direction === 'THEY_OWE_ME' ? 'They owe you' : 'You owe them';

  const handleDelete = () => {
    Alert.alert(
      'Delete this debt?',
      'This will permanently remove this debt and its payment history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteDebt(debt.id);
              router.back();
            } catch {
              Alert.alert('Error', 'Could not delete debt. Please try again.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <Screen scroll>
      <BackHeader title={person?.name ?? 'Debt'} />

      <Animated.View entering={FadeInDown.duration(TIMING_NORMAL.duration!)}>
        <Card level="hero" style={{ marginBottom: theme.spacing.lg }}>
          <View style={styles.rowBetween}>
            <Text variant="label" color="muted">{directionLabel}</Text>
            <StatusBadge status={status} />
          </View>

          {isPaid ? (
            <Animated.View
              entering={ZoomIn.duration(TIMING_SLOW.duration!)}
              style={[styles.settledBanner, { marginTop: theme.spacing.lg }]}
            >
              <CheckCircle2 size={22} color={theme.colors.success} strokeWidth={2} />
              <Text variant="body" color="success" style={{ fontWeight: '600', marginLeft: 8 }}>
                Done. Settled.
              </Text>
            </Animated.View>
          ) : null}

          <Text variant="label" color="muted" style={[styles.uppercase, { marginTop: theme.spacing.lg }]}>
            {isPaid ? 'Original amount' : 'Remaining'}
          </Text>
          <AnimatedNumber
            value={isPaid ? debt.originalAmount : remaining}
            formatter={(value) => formatCurrency(value, currency)}
            variant="display"
            style={{ marginTop: theme.spacing.xs }}
          />

          <View style={[styles.amountGrid, { marginTop: theme.spacing.lg }]}>
            <AmountItem label="Original" value={debt.originalAmount} currency={currency} />
            <AmountItem label="Paid" value={debt.amountPaid} currency={currency} />
            {!isPaid ? (
              <AmountItem label="Remaining" value={remaining} currency={currency} emphasized />
            ) : null}
          </View>

          <View style={{ marginTop: theme.spacing.lg }}>
            <View style={styles.rowBetween}>
              <Text variant="caption" color="muted">Progress</Text>
              <Text variant="caption" color="muted">{formatPercent(progress)}</Text>
            </View>
            <ProgressBar progress={progress} />
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(STAGGER.sm)}>
        <Card level="flat" style={{ marginBottom: theme.spacing.lg }}>
          {debt.dueDate ? <DetailRow label="Due date" value={formatDate(debt.dueDate)} /> : null}
          <DetailRow label="Created" value={formatDate(debt.createdAt)} />
          <DetailRow label="Category" value={getCategoryLabel(debt.category)} />
          {debt.note ? <DetailRow label="Note" value={debt.note} /> : null}
        </Card>
      </Animated.View>

      <SectionHeader title="Payment history" />
      {payments.length === 0 ? (
        <Card level="flat" style={{ marginBottom: theme.spacing.lg }}>
          <Text variant="bodySmall" color="muted">No payments recorded yet</Text>
        </Card>
      ) : (
        <Card padded={false} style={{ marginBottom: theme.spacing.lg }}>
          {payments.map((payment, index) => (
            <Animated.View
              key={payment.id}
              entering={FadeIn.duration(TIMING_NORMAL.duration!).delay(index * STAGGER.xs)}
            >
              <View style={{ padding: theme.spacing.md }}>
                <View style={styles.rowBetween}>
                  <Text variant="body" style={{ fontWeight: '600' }}>
                    {formatCurrency(payment.amount, currency)}
                  </Text>
                  <Text variant="caption" color="muted">{formatDate(payment.date)}</Text>
                </View>
                <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
                  {getPaymentMethodLabel(payment.method)}
                  {payment.note ? ` · ${payment.note}` : ''}
                </Text>
              </View>
              {index < payments.length - 1 ? <Divider inset={theme.spacing.md} /> : null}
            </Animated.View>
          ))}
        </Card>
      )}

      {!isPaid ? (
        <Button
          label="Record payment"
          fullWidth
          onPress={() =>
            router.push({ pathname: '/debt/[id]/payment', params: { id: debt.id } })
          }
          style={{ marginBottom: theme.spacing.sm }}
        />
      ) : null}

      <Button
        label="Edit"
        variant="secondary"
        fullWidth
        onPress={() =>
          router.push({ pathname: '/debt/[id]/edit', params: { id: debt.id } })
        }
        style={{ marginBottom: theme.spacing.sm }}
      />

      <Button
        label={deleting ? 'Deleting...' : 'Delete'}
        variant="ghost"
        fullWidth
        disabled={deleting}
        onPress={handleDelete}
      />
    </Screen>
  );
}

function AmountItem({
  label,
  value,
  currency,
  emphasized,
}: {
  label: string;
  value: number;
  currency: string;
  emphasized?: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text variant="caption" color="muted">{label}</Text>
      <AnimatedNumber
        value={value}
        formatter={(amount) => formatCurrency(amount, currency)}
        variant="bodySmall"
        style={{ marginTop: 2, fontWeight: emphasized ? '700' : '600' }}
      />
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.amountRow, { marginBottom: theme.spacing.sm }]}>
      <Text variant="bodySmall" color="muted">{label}</Text>
      <Text variant="bodySmall" style={{ flex: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  amountGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
