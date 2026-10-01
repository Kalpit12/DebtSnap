import { readStorage, writeStorage } from '@/lib/storage';
import type { Debt, DebtCategory, DebtDirection } from '@/types/debt';
import { generateId } from '@/utils/id';

export interface CreateDebtInput {
  personId: string;
  direction: DebtDirection;
  originalAmount: number;
  currency: string;
  date: string;
  dueDate?: string;
  category: DebtCategory;
  note?: string;
}

export interface UpdateDebtInput {
  personId?: string;
  direction?: DebtDirection;
  originalAmount?: number;
  date?: string;
  dueDate?: string | null;
  category?: DebtCategory;
  note?: string | null;
}

export async function getAllDebts(): Promise<Debt[]> {
  const storage = await readStorage();
  return storage.debts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getDebtById(id: string): Promise<Debt | undefined> {
  const storage = await readStorage();
  return storage.debts.find((debt) => debt.id === id);
}

export async function getDebtsByPersonId(personId: string): Promise<Debt[]> {
  const storage = await readStorage();
  return storage.debts
    .filter((debt) => debt.personId === personId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createDebt(input: CreateDebtInput): Promise<Debt> {
  const storage = await readStorage();
  const now = new Date().toISOString();
  const debt: Debt = {
    id: generateId(),
    personId: input.personId,
    direction: input.direction,
    originalAmount: input.originalAmount,
    amountPaid: 0,
    currency: input.currency,
    date: input.date,
    dueDate: input.dueDate || undefined,
    category: input.category,
    note: input.note?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };

  storage.debts.push(debt);
  await writeStorage(storage);
  return debt;
}

export async function updateDebt(id: string, input: UpdateDebtInput): Promise<Debt> {
  const storage = await readStorage();
  const index = storage.debts.findIndex((debt) => debt.id === id);
  if (index === -1) {
    throw new Error('Debt not found');
  }

  const existing = storage.debts[index];

  if (input.originalAmount !== undefined && input.originalAmount < existing.amountPaid) {
    throw new Error('Amount cannot be less than payments already recorded.');
  }

  const updated: Debt = {
    ...existing,
    personId: input.personId ?? existing.personId,
    direction: input.direction ?? existing.direction,
    originalAmount: input.originalAmount ?? existing.originalAmount,
    date: input.date ?? existing.date,
    dueDate:
      input.dueDate === null
        ? undefined
        : input.dueDate !== undefined
          ? input.dueDate || undefined
          : existing.dueDate,
    category: input.category ?? existing.category,
    note:
      input.note === null
        ? undefined
        : input.note !== undefined
          ? input.note.trim() || undefined
          : existing.note,
    updatedAt: new Date().toISOString(),
  };

  storage.debts[index] = updated;
  await writeStorage(storage);
  return updated;
}

export async function deleteDebt(id: string): Promise<void> {
  const storage = await readStorage();
  storage.debts = storage.debts.filter((debt) => debt.id !== id);
  storage.payments = storage.payments.filter((payment) => payment.debtId !== id);
  await writeStorage(storage);
}
