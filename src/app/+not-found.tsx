import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Screen>
        <View style={styles.content}>
          <Text variant="h2">Page not found</Text>
          <Link href="/" style={{ marginTop: theme.spacing.md }}>
            <Text variant="body" color="accent">Go to Home</Text>
          </Link>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
