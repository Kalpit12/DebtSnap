import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  debtsRepository,
  paymentsRepository,
  peopleRepository,
} from '@/data/repositories';
import type { CreateDebtInput, UpdateDebtInput } from '@/data/repositories/debtsRepository';
import type { CreatePaymentInput } from '@/data/repositories/paymentsRepository';
import { readStorage, writeStorage } from '@/lib/storage';
import { buildExportPayload, serializeExportPayload } from '@/utils/export';
import type { Debt } from '@/types/debt';
import type { Payment } from '@/types/payment';
import type { Person } from '@/types/person';

interface AppDataContextValue {
  isLoading: boolean;
  people: Person[];
  debts: Debt[];
  payments: Payment[];
  currency: string;
  setCurrency: (currency: string) => Promise<void>;
  exportData: () => Promise<string>;
  refresh: () => Promise<void>;
  createPerson: (input: { name: string; phone?: string }) => Promise<Person>;
  updatePerson: (id: string, input: { name?: string; phone?: string }) => Promise<Person>;
  deletePerson: (id: string) => Promise<void>;
  createDebt: (input: CreateDebtInput) => Promise<Debt>;
  updateDebt: (id: string, input: UpdateDebtInput) => Promise<Debt>;
  deleteDebt: (id: string) => Promise<void>;
  createPayment: (input: CreatePaymentInput) => Promise<Payment>;
  getPaymentsForDebt: (debtId: string) => Payment[];
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [people, setPeople] = useState<Person[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currency, setCurrencyState] = useState('KES');

  const refresh = useCallback(async () => {
    const storage = await readStorage();
    setPeople(storage.people);
    setDebts(storage.debts);
    setPayments(storage.payments);
    setCurrencyState(storage.preferences.currency);
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const createPerson = useCallback(
    async (input: { name: string; phone?: string }) => {
      const person = await peopleRepository.createPerson(input);
      await refresh();
      return person;
    },
    [refresh],
  );

  const updatePerson = useCallback(
    async (id: string, input: { name?: string; phone?: string }) => {
      const person = await peopleRepository.updatePerson(id, input);
      await refresh();
      return person;
    },
    [refresh],
  );

  const deletePerson = useCallback(
    async (id: string) => {
      await peopleRepository.deletePerson(id);
      await refresh();
    },
    [refresh],
  );

  const createDebt = useCallback(
    async (input: CreateDebtInput) => {
      const debt = await debtsRepository.createDebt(input);
      await refresh();
      return debt;
    },
    [refresh],
  );

  const updateDebt = useCallback(
    async (id: string, input: UpdateDebtInput) => {
      const debt = await debtsRepository.updateDebt(id, input);
      await refresh();
      return debt;
    },
    [refresh],
  );

  const deleteDebt = useCallback(
    async (id: string) => {
      await debtsRepository.deleteDebt(id);
      await refresh();
    },
    [refresh],
  );

  const createPayment = useCallback(
    async (input: CreatePaymentInput) => {
      const payment = await paymentsRepository.createPayment(input);
      await refresh();
      return payment;
    },
    [refresh],
  );

  const getPaymentsForDebt = useCallback(
    (debtId: string) =>
      payments
        .filter((payment) => payment.debtId === debtId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [payments],
  );

  const setCurrency = useCallback(
    async (nextCurrency: string) => {
      const storage = await readStorage();
      await writeStorage({
        ...storage,
        preferences: {
          ...storage.preferences,
          currency: nextCurrency,
        },
      });
      await refresh();
    },
    [refresh],
  );

  const exportData = useCallback(async () => {
    const payload = await buildExportPayload();
    return serializeExportPayload(payload);
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      people,
      debts,
      payments,
      currency,
      setCurrency,
      exportData,
      refresh,
      createPerson,
      updatePerson,
      deletePerson,
      createDebt,
      updateDebt,
      deleteDebt,
      createPayment,
      getPaymentsForDebt,
    }),
    [
      isLoading,
      people,
      debts,
      payments,
      currency,
      setCurrency,
      exportData,
      refresh,
      createPerson,
      updatePerson,
      deletePerson,
      createDebt,
      updateDebt,
      deleteDebt,
      createPayment,
      getPaymentsForDebt,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}
