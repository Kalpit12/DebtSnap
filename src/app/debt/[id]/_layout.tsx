import { Stack } from 'expo-router';

export default function DebtLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" options={{ presentation: 'modal' }} />
      <Stack.Screen name="payment" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
