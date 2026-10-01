import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { FormScreen } from '@/components/layout/FormScreen';
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
import { PressableScale } from '@/components/motion';
import { DEBT_CATEGORIES } from '@/constants/categories';
import { STAGGER, TIMING_NORMAL } from '@/constants/motion';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';
import type { DebtCategory, DebtDirection } from '@/types/debt';
import { getCurrencySymbol, parseAmount, toISODate } from '@/utils/format';

const DIRECTIONS: { value: DebtDirection; label: string }[] = [
  { value: 'THEY_OWE_ME', label: 'They owe me' },
  { value: 'I_OWE', label: 'I owe them' },
];

export default function AddScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ personId?: string }>();
  const { people, currency, createDebt } = useAppData();

  const [direction, setDirection] = useState<DebtDirection>('THEY_OWE_ME');
  const [amount, setAmount] = useState('');
  const [personId, setPersonId] = useState<string | undefined>();
  const [date, setDate] = useState(toISODate(new Date()));
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [category, setCategory] = useState<DebtCategory>('PERSONAL');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.personId) {
      setPersonId(params.personId);
    }
  }, [params.personId]);

  const selectedPerson = useMemo(
    () => people.find((person) => person.id === personId),
    [people, personId],
  );

  const amountValue = parseAmount(amount);
  const directionLabel = direction === 'THEY_OWE_ME' ? 'They owe me' : 'I owe them';

  const handleSave = async () => {
    if (amountValue <= 0) {
      Alert.alert('Invalid amount', 'Amount must be greater than 0.');
      return;
    }
    if (!personId) {
      Alert.alert('Person required', 'Please select or add a person.');
      return;
    }

    setSaving(true);
    try {
      const debt = await createDebt({
        personId,
        direction,
        originalAmount: amountValue,
        currency,
        date,
        dueDate,
        category,
        note: note.trim() || undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: '/debt/[id]', params: { id: debt.id } });
    } catch {
      Alert.alert('Error', 'Could not save debt. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreen tabBarClearance>
      <Animated.View
        entering={FadeInDown.duration(TIMING_NORMAL.duration!)}
        style={styles.header}
      >
        <Text variant="h1">Add debt</Text>
        <Text variant="body" color="muted" style={{ marginTop: theme.spacing.xs }}>
          {directionLabel}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(STAGGER.sm)}>
        <SegmentedControl options={DIRECTIONS} value={direction} onChange={setDirection} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(STAGGER.md)}>
        <AmountInput
          value={amount}
          onChangeText={setAmount}
          currencySymbol={getCurrencySymbol(currency)}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(STAGGER.lg)}>
        <Text variant="label" color="muted" style={styles.sectionLabel}>
          Person
        </Text>
        <PressableScale
          onPress={() => router.push({ pathname: '/person/select', params: { returnTo: 'add' } })}
          style={{ marginBottom: theme.spacing.lg }}
        >
          <Card level="elevated">
            <View style={styles.personRow}>
              {selectedPerson ? (
                <PersonAvatar name={selectedPerson.name} size="sm" />
              ) : null}
              <Text
                variant="body"
                color={selectedPerson ? 'primary' : 'muted'}
                style={{ flex: 1, fontWeight: selectedPerson ? '600' : '400' }}
              >
                {selectedPerson?.name ?? 'Select a person'}
              </Text>
              <ChevronRight size={18} color={theme.colors.mutedText} strokeWidth={2} />
            </View>
          </Card>
        </PressableScale>
      </Animated.View>

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
        placeholder="Optional note"
        multiline
        style={{ height: 96, paddingTop: 14, textAlignVertical: 'top' }}
      />

      <Button
        label={saving ? 'Saving...' : 'Save debt'}
        fullWidth
        disabled={saving}
        onPress={handleSave}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    marginBottom: 24,
  },
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
