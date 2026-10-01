import { useRouter } from 'expo-router';
import { Search, Users } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { Button, Card, Divider, EmptyState, ListRow, Screen, SearchField, Text } from '@/components/ui';
import { STAGGER, TIMING_NORMAL } from '@/constants/motion';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';
import { filterPeople } from '@/utils/filterPeople';
import { calculatePersonBalance } from '@/utils/finance';
import { formatCurrency } from '@/utils/format';

export default function PeopleScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { people, debts, currency } = useAppData();
  const [query, setQuery] = useState('');

  const filteredPeople = useMemo(
    () => filterPeople(people, query),
    [people, query],
  );

  const openNewPerson = () => {
    router.push({ pathname: '/person/new', params: { returnTo: 'people' } });
  };

  const hasPeople = people.length > 0;
  const hasResults = filteredPeople.length > 0;

  return (
    <Screen scroll tabBarClearance>
      <Animated.View
        entering={FadeInDown.duration(TIMING_NORMAL.duration!)}
        style={[styles.header, { marginBottom: theme.spacing.lg }]}
      >
        <Text variant="h1">People</Text>
        <Text variant="body" color="muted" style={{ marginTop: theme.spacing.xs }}>
          Your financial contacts
        </Text>
      </Animated.View>

      {hasPeople ? (
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or phone"
          style={{ marginBottom: theme.spacing.md }}
        />
      ) : null}

      <Button
        label="Add person"
        variant="secondary"
        fullWidth
        onPress={openNewPerson}
        style={{ marginBottom: theme.spacing.lg }}
      />

      {!hasPeople ? (
        <EmptyState
          icon={Users}
          title="No people yet"
          description="Add someone to start tracking money you owe or money owed to you."
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
        <Card padded={false}>
          {filteredPeople.map((person, index) => {
            const balance = calculatePersonBalance(person.id, debts);
            const isSettled = balance === 0;
            const subtitle = balance > 0 ? 'Owes you' : balance < 0 ? 'You owe' : 'Settled';
            const value = isSettled ? undefined : formatCurrency(Math.abs(balance), currency);
            const valueColor = balance > 0 ? 'success' : balance < 0 ? 'danger' : 'muted';

            return (
              <Animated.View
                key={person.id}
                layout={Layout.springify()}
                entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(
                  index * STAGGER.xs,
                )}
              >
                <ListRow
                  title={person.name}
                  subtitle={subtitle}
                  value={value}
                  valueColor={isSettled ? 'muted' : valueColor}
                  avatarName={person.name}
                  onPress={() =>
                    router.push({ pathname: '/person/[id]', params: { id: person.id } })
                  }
                  style={{ paddingHorizontal: theme.spacing.md }}
                />
                {index < filteredPeople.length - 1 ? <Divider inset={theme.spacing.md + 48} /> : null}
              </Animated.View>
            );
          })}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
  },
});
