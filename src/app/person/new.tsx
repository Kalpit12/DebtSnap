import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { BackHeader } from '@/components/layout/BackHeader';
import { FormScreen } from '@/components/layout/FormScreen';
import { Button, TextField } from '@/components/ui';
import { useAppData } from '@/hooks/useAppData';

export default function NewPersonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string; debtId?: string }>();
  const { createPerson } = useAppData();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter a name.');
      return;
    }

    setSaving(true);
    try {
      const person = await createPerson({
        name: trimmedName,
        phone: phone.trim() || undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (params.returnTo === 'add') {
        router.replace({ pathname: '/(tabs)/add', params: { personId: person.id } });
        return;
      }

      if (params.returnTo === 'people') {
        router.replace('/(tabs)/people');
        return;
      }

      if (params.returnTo === 'edit' && params.debtId) {
        router.replace({
          pathname: '/debt/[id]/edit',
          params: { id: params.debtId, personId: person.id },
        });
        return;
      }

      router.replace('/(tabs)/people');
    } catch {
      Alert.alert('Error', 'Could not create person. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreen>
      <BackHeader title="Add person" onBack={() => router.back()} />

      <TextField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Full name"
      />
      <TextField
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="Optional"
        keyboardType="phone-pad"
      />

      <Button
        label={saving ? 'Saving...' : 'Save person'}
        fullWidth
        disabled={saving}
        onPress={handleSave}
      />
    </FormScreen>
  );
}
