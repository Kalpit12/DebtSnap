import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEY } from './keys';
import { defaultStorageSchema, StorageSchema } from './schema';

export async function readStorage(): Promise<StorageSchema> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultStorageSchema;
    }

    const parsed = JSON.parse(raw) as Partial<StorageSchema>;

    return {
      ...defaultStorageSchema,
      ...parsed,
      preferences: {
        ...defaultStorageSchema.preferences,
        ...parsed.preferences,
      },
    };
  } catch {
    return defaultStorageSchema;
  }
}

export async function writeStorage(data: StorageSchema): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function clearStorage(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
