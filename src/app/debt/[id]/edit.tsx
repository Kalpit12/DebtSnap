import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { BackHeader } from '@/components/layout/BackHeader';
import { FormScreen } from '@/components/layout/FormScreen';
import { PressableScale } from '@/components/motion';
import {
  AmountInput,
  Button,
  Card,
  ChipSelector,
  DateField,
  PersonAvatar,
  SegmentedControl,
  Text,
  TextField,
} from '@/components/ui';
import { DEBT_CATEGORIES } from '@/constants/categories';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';
import type { DebtCategory, DebtDirection } from '@/types/debt';
import { formatCurrency, getCurrencySymbol, parseAmount } from '@/utils/format';

const DIRECTIONS: { value: DebtDirection; label: string }[] = [
  { value: 'THEY_OWE_ME', label: 'They owe me' },
  { value: 'I_OWE', label: 'I owe them' },
];

export default function EditDebtScreen() {
  const { id, personId: selectedPersonId } = useLocalSearchParams<{ id: string; personId?: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { debts, people, currency, updateDebt } = useAppData();

  const debt = debts.find((item) => item.id === id);
  const [direction, setDirection] = useState<DebtDirection>('THEY_OWE_ME');
  const [amount, setAmount] = useState('');
  const [personId, setPersonId] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [category, setCategory] = useState<DebtCategory>('PERSONAL');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!debt) return;
    setDirection(debt.direction);
    setAmount(String(debt.originalAmount));
    setPersonId(debt.personId);
    setDate(debt.date);
    setDueDate(debt.dueDate);
    setCategory(debt.category);
    setNote(debt.note ?? '');
  }, [debt]);

  useEffect(() => {
    if (selectedPersonId) {
      setPersonId(selectedPersonId);
    }
  }, [selectedPersonId]);

  const selectedPerson = useMemo(
    () => people.find((person) => person.id === personId),
    [people, personId],
  );

  if (!debt) {
    return (
      <FormScreen>
        <Text variant="body" color="muted">Debt not found.</Text>
      </FormScreen>
    );
  }

  const handleSave = async () => {
    const amountValue = parseAmount(amount);
    if (amountValue <= 0) {
      Alert.alert('Invalid amount', 'Amount must be greater than 0.');
      return;
    }
    if (amountValue < debt.amountPaid) {
      Alert.alert(
        'Invalid amount',
        'Amount cannot be less than payments already recorded.',
      );
      return;
    }
    if (!personId) {
      Alert.alert('Person required', 'Please select a person.');
      return;
    }

    setSaving(true);
    try {
      await updateDebt(debt.id, {
        personId,
        direction,
        originalAmount: amountValue,
        date,
        dueDate: dueDate ?? null,
        category,
        note: note.trim() || null,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Could not update debt.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreen>
      <BackHeader title="Edit debt" onBack={() => router.back()} />

      <SegmentedControl options={DIRECTIONS} value={direction} onChange={setDirection} />

      <AmountInput
        value={amount}
        onChangeText={setAmount}
        currencySymbol={getCurrencySymbol(currency)}
        helperText={`Paid so far: ${formatCurrency(debt.amountPaid, currency)}`}
      />

      <Text variant="label" color="muted" style={styles.sectionLabel}>
        Person
      </Text>
      <PressableScale
        onPress={() =>
          router.push({
            pathname: '/person/select',
            params: { returnTo: 'edit', debtId: debt.id },
          })
        }
        style={{ marginBottom: theme.spacing.lg }}
      >
        <Card level="elevated">
          <View style={styles.personRow}>
            {selectedPerson ? <PersonAvatar name={selectedPerson.name} size="sm" /> : null}
            <Text variant="body" style={{ flex: 1, fontWeight: '600' }}>
              {selectedPerson?.name ?? 'Select person'}
            </Text>
            <ChevronRight size={18} color={theme.colors.mutedText} strokeWidth={2} />
          </View>
        </Card>
      </PressableScale>

      <DateField label="Date" value={date} onChange={(value) => value && setDate(value)} />
      <DateField label="Due date" value={dueDate} onChange={setDueDate} optional />

      <Text variant="label" color="muted" style={styles.sectionLabel}>
        Category
      </Text>
      <ChipSelector options={DEBT_CATEGORIES} value={category} onChange={setCategory} />

      <TextField
        label="Note"
        value={note}
        onChangeText={setNote}
        multiline
        style={{ height: 88, paddingTop: 14, textAlignVertical: 'top' }}
      />

      <Button
        label={saving ? 'Saving...' : 'Save changes'}
        fullWidth
        disabled={saving}
        onPress={handleSave}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
