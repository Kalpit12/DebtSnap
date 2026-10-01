import { readStorage, writeStorage } from '@/lib/storage';
import type { Payment, PaymentMethod } from '@/types/payment';
import { calculateDebtRemaining } from '@/utils/finance';
import { generateId } from '@/utils/id';

export interface CreatePaymentInput {
  debtId: string;
  amount: number;
  currency: string;
  date: string;
  method: PaymentMethod;
  note?: string;
}

export async function getPaymentsForDebt(debtId: string): Promise<Payment[]> {
  const storage = await readStorage();
  return storage.payments
    .filter((payment) => payment.debtId === debtId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const storage = await readStorage();
  const debtIndex = storage.debts.findIndex((debt) => debt.id === input.debtId);
  if (debtIndex === -1) {
    throw new Error('Debt not found');
  }

  const debt = storage.debts[debtIndex];
  const remaining = calculateDebtRemaining(debt);

  if (input.amount <= 0) {
    throw new Error('Payment amount must be greater than 0');
  }

  if (input.amount > remaining) {
    throw new Error('Payment cannot exceed remaining balance');
  }

  const now = new Date().toISOString();
  const payment: Payment = {
    id: generateId(),
    debtId: input.debtId,
    amount: input.amount,
    currency: input.currency,
    date: input.date,
    method: input.method,
    note: input.note?.trim() || undefined,
    createdAt: now,
  };

  storage.payments.push(payment);
  storage.debts[debtIndex] = {
    ...debt,
    amountPaid: debt.amountPaid + input.amount,
    updatedAt: now,
  };

  await writeStorage(storage);
  return payment;
}

export async function deletePayment(id: string): Promise<void> {
  const storage = await readStorage();
  const payment = storage.payments.find((item) => item.id === id);
  if (!payment) {
    return;
  }

  const debtIndex = storage.debts.findIndex((debt) => debt.id === payment.debtId);
  if (debtIndex !== -1) {
    const debt = storage.debts[debtIndex];
    storage.debts[debtIndex] = {
      ...debt,
      amountPaid: Math.max(0, debt.amountPaid - payment.amount),
      updatedAt: new Date().toISOString(),
    };
  }

  storage.payments = storage.payments.filter((item) => item.id !== id);
  await writeStorage(storage);
}
