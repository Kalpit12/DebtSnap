import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { BackHeader } from '@/components/layout/BackHeader';
import { FormScreen } from '@/components/layout/FormScreen';
import {
  AmountInput,
  Button,
  DateField,
  PaymentMethodSelector,
  Text,
  TextField,
} from '@/components/ui';
import { TIMING_NORMAL } from '@/constants/motion';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';
import type { PaymentMethod } from '@/types/payment';
import { formatCurrency, getCurrencySymbol, parseAmount, toISODate } from '@/utils/format';
import { calculateDebtRemaining } from '@/utils/finance';

export default function RecordPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { debts, currency, createPayment } = useAppData();

  const debt = debts.find((item) => item.id === id);
  const remaining = debt ? calculateDebtRemaining(debt) : 0;

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(toISODate(new Date()));
  const [method, setMethod] = useState<PaymentMethod>('MPESA');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const amountValue = parseAmount(amount);

  const displayRemaining = useMemo(
    () => formatCurrency(remaining, currency),
    [remaining, currency],
  );

  if (!debt) {
    return (
      <FormScreen>
        <Text variant="body" color="muted">Debt not found.</Text>
      </FormScreen>
    );
  }

  const handleSave = async () => {
    if (amountValue <= 0) {
      Alert.alert('Invalid amount', 'Payment amount must be greater than 0.');
      return;
    }
    if (amountValue > remaining) {
      Alert.alert('Too much', 'Payment cannot exceed remaining balance.');
      return;
    }

    setSaving(true);
    try {
      await createPayment({
        debtId: debt.id,
        amount: amountValue,
        currency,
        date,
        method,
        note: note.trim() || undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess(true);
      setTimeout(() => router.back(), 600);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Could not record payment.');
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <FormScreen>
        <Animated.View entering={ZoomIn.duration(TIMING_NORMAL.duration!)} style={styles.successWrap}>
          <CheckCircle2 size={48} color={theme.colors.success} strokeWidth={1.75} />
          <Text variant="h3" style={{ marginTop: theme.spacing.md }}>
            Payment recorded
          </Text>
          <Text variant="bodySmall" color="muted" style={{ marginTop: theme.spacing.xs }}>
            Done. Settled.
          </Text>
        </Animated.View>
      </FormScreen>
    );
  }

  return (
    <FormScreen>
      <BackHeader title="Record payment" onBack={() => router.back()} />

      <Animated.View entering={FadeIn.duration(TIMING_NORMAL.duration!)}>
        <AmountInput
          value={amount}
          onChangeText={setAmount}
          currencySymbol={getCurrencySymbol(currency)}
          helperText={`${displayRemaining} remaining`}
        />
      </Animated.View>

      <DateField label="Date" value={date} onChange={(value) => value && setDate(value)} />

      <Text variant="label" color="muted" style={{ marginBottom: 8, textTransform: 'uppercase' }}>
        Payment method
      </Text>
      <PaymentMethodSelector value={method} onChange={setMethod} />

      <TextField
        label="Note"
        value={note}
        onChangeText={setNote}
        placeholder="Optional"
        multiline
        style={{ height: 88, paddingTop: 14, textAlignVertical: 'top' }}
      />

      <Button
        label={saving ? 'Saving...' : 'Save payment'}
        fullWidth
        disabled={saving}
        onPress={handleSave}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
});
