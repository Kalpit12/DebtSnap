import type { Debt, DebtStatus } from '@/types/debt';

export function calculateDebtRemaining(debt: Debt): number {
  return Math.max(0, debt.originalAmount - debt.amountPaid);
}

export function getDebtStatus(debt: Debt, now = new Date()): DebtStatus {
  const remaining = calculateDebtRemaining(debt);

  if (remaining === 0) {
    return 'PAID';
  }

  if (debt.dueDate) {
    const due = new Date(debt.dueDate);
    due.setHours(23, 59, 59, 999);
    if (due < now && remaining > 0) {
      return 'OVERDUE';
    }
  }

  if (debt.amountPaid > 0 && remaining > 0) {
    return 'PARTIALLY_PAID';
  }

  return 'ACTIVE';
}

export function calculatePersonBalance(personId: string, debts: Debt[]): number {
  return debts
    .filter((debt) => debt.personId === personId)
    .reduce((sum, debt) => {
      const remaining = calculateDebtRemaining(debt);
      if (remaining === 0) {
        return sum;
      }
      return debt.direction === 'THEY_OWE_ME' ? sum + remaining : sum - remaining;
    }, 0);
}

export function calculatePersonOwedToMe(personId: string, debts: Debt[]): number {
  return debts
    .filter((debt) => debt.personId === personId && debt.direction === 'THEY_OWE_ME')
    .reduce((sum, debt) => sum + calculateDebtRemaining(debt), 0);
}

export function calculatePersonIOwe(personId: string, debts: Debt[]): number {
  return debts
    .filter((debt) => debt.personId === personId && debt.direction === 'I_OWE')
    .reduce((sum, debt) => sum + calculateDebtRemaining(debt), 0);
}

export interface DashboardTotals {
  owedToMe: number;
  iOwe: number;
  netBalance: number;
}

export function calculateDashboardTotals(debts: Debt[]): DashboardTotals {
  let owedToMe = 0;
  let iOwe = 0;

  for (const debt of debts) {
    const remaining = calculateDebtRemaining(debt);
    if (remaining <= 0) {
      continue;
    }
    if (debt.direction === 'THEY_OWE_ME') {
      owedToMe += remaining;
    } else {
      iOwe += remaining;
    }
  }

  return {
    owedToMe,
    iOwe,
    netBalance: owedToMe - iOwe,
  };
}

export function getDebtProgress(debt: Debt): number {
  if (debt.originalAmount <= 0) {
    return 0;
  }
  return Math.min(100, (debt.amountPaid / debt.originalAmount) * 100);
}

export function getUnpaidDebtsWithDueDate(debts: Debt[]): Debt[] {
  return debts
    .filter((debt) => {
      const remaining = calculateDebtRemaining(debt);
      return remaining > 0 && debt.dueDate;
    })
    .sort((a, b) => {
      const statusA = getDebtStatus(a);
      const statusB = getDebtStatus(b);
      if (statusA === 'OVERDUE' && statusB !== 'OVERDUE') return -1;
      if (statusB === 'OVERDUE' && statusA !== 'OVERDUE') return 1;
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    });
}
