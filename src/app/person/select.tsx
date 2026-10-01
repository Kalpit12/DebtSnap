import { useLocalSearchParams, useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackHeader } from '@/components/layout/BackHeader';
import { PressableScale } from '@/components/motion';
import {
  Button,
  Card,
  Divider,
  EmptyState,
  PersonAvatar,
  SearchField,
  Text,
} from '@/components/ui';
import { STAGGER, TIMING_NORMAL } from '@/constants/motion';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';
import { filterPeople } from '@/utils/filterPeople';
import { calculatePersonBalance } from '@/utils/finance';
import { formatSignedCurrency } from '@/utils/format';

export default function PersonSelectScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ returnTo?: string; debtId?: string }>();
  const { people, debts, currency } = useAppData();
  const [query, setQuery] = useState('');

  const filteredPeople = useMemo(
    () => filterPeople(people, query),
    [people, query],
  );

  const handleSelect = (personId: string) => {
    if (params.returnTo === 'add') {
      router.replace({ pathname: '/(tabs)/add', params: { personId } });
      return;
    }
    if (params.returnTo === 'edit' && params.debtId) {
      router.replace({
        pathname: '/debt/[id]/edit',
        params: { id: params.debtId, personId },
      });
      return;
    }
    router.back();
  };

  const openNewPerson = () => {
    router.push({
      pathname: '/person/new',
      params: {
        returnTo: params.returnTo ?? 'add',
        debtId: params.debtId,
      },
    });
  };

  const hasPeople = people.length > 0;
  const hasResults = filteredPeople.length > 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + theme.spacing.sm,
          paddingBottom: insets.bottom + theme.spacing.md,
          paddingHorizontal: theme.screenPadding,
        },
      ]}
    >
      <BackHeader title="Select person" onBack={() => router.back()} />

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search people"
        style={{ marginBottom: theme.spacing.md }}
      />

      <Button
        label="Add new person"
        variant="secondary"
        fullWidth
        onPress={openNewPerson}
        style={{ marginBottom: theme.spacing.md }}
      />

      {!hasPeople ? (
        <EmptyState
          icon={Search}
          title="No people yet"
          description="Add someone to start tracking."
          actionLabel="Add person"
          onAction={openNewPerson}
        />
      ) : !hasResults ? (
        <EmptyState
          icon={Search}
          title="No matches found"
          description="Try a different name or phone number."
        />
      ) : (
        <Card padded={false} level="elevated">
          {filteredPeople.map((person, index) => {
            const balance = calculatePersonBalance(person.id, debts);
            const valueColor = balance > 0 ? theme.colors.success : balance < 0 ? theme.colors.danger : theme.colors.mutedText;

            return (
              <Animated.View
                key={person.id}
                layout={Layout.springify()}
                entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(index * STAGGER.xs)}
              >
                <PressableScale
                  onPress={() => handleSelect(person.id)}
                  style={[styles.row, { paddingHorizontal: theme.spacing.md }]}
                >
                  <PersonAvatar name={person.name} size="sm" />
                  <View style={styles.content}>
                    <Text variant="body" style={{ fontWeight: '500' }}>{person.name}</Text>
                    {person.phone ? (
                      <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                        {person.phone}
                      </Text>
                    ) : null}
                  </View>
                  <Text variant="bodySmall" style={{ color: valueColor, fontWeight: '600' }}>
                    {formatSignedCurrency(balance, currency)}
                  </Text>
                </PressableScale>
                {index < filteredPeople.length - 1 ? <Divider inset={theme.spacing.md + 48} /> : null}
              </Animated.View>
            );
          })}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
  },
});
