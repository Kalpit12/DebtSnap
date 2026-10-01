import type { Debt } from '@/types/debt';
import type { Payment } from '@/types/payment';
import type { Person } from '@/types/person';
import { STORAGE_VERSION } from './keys';

export interface StorageSchema {
  version: typeof STORAGE_VERSION;
  people: Person[];
  debts: Debt[];
  payments: Payment[];
  preferences: {
    currency: string;
    themeMode: 'light' | 'dark' | 'system';
  };
}

export const defaultStorageSchema: StorageSchema = {
  version: STORAGE_VERSION,
  people: [],
  debts: [],
  payments: [],
  preferences: {
    currency: 'KES',
    themeMode: 'system',
  },
};
