import type { Debt, DebtCategory, DebtStatus } from '@/types/debt';
import type { Payment } from '@/types/payment';
import {
  calculateDashboardTotals,
  calculateDebtRemaining,
  getDebtStatus,
} from '@/utils/finance';

export interface InsightsOverview {
  totalOutstanding: number;
  totalCollected: number;
  totalYouOwe: number;
  activeDebts: number;
  overdueDebts: number;
  paidDebts: number;
}

export interface CollectionSummary {
  originallyOwed: number;
  collected: number;
  outstanding: number;
  collectionPercent: number;
}

export interface MonthlyActivityItem {
  key: string;
  label: string;
  debtsCreated: number;
  paymentsRecorded: number;
}

export interface CategoryBreakdownItem {
  category: DebtCategory;
  amount: number;
}

export interface DebtHealthSummary {
  active: number;
  overdue: number;
  partiallyPaid: number;
  paid: number;
}

export function calculateInsightsOverview(debts: Debt[]): InsightsOverview {
  const totals = calculateDashboardTotals(debts);
  let totalCollected = 0;
  let activeDebts = 0;
  let overdueDebts = 0;
  let paidDebts = 0;

  for (const debt of debts) {
    totalCollected += debt.amountPaid;
    const status = getDebtStatus(debt);
    if (status === 'PAID') {
      paidDebts += 1;
    } else {
      activeDebts += 1;
      if (status === 'OVERDUE') {
        overdueDebts += 1;
      }
    }
  }

  return {
    totalOutstanding: totals.owedToMe,
    totalCollected,
    totalYouOwe: totals.iOwe,
    activeDebts,
    overdueDebts,
    paidDebts,
  };
}

export function calculateCollectionSummary(debts: Debt[]): CollectionSummary {
  let originallyOwed = 0;
  let collected = 0;
  let outstanding = 0;

  for (const debt of debts) {
    if (debt.direction !== 'THEY_OWE_ME') {
      continue;
    }
    originallyOwed += debt.originalAmount;
    collected += debt.amountPaid;
    outstanding += calculateDebtRemaining(debt);
  }

  const collectionPercent =
    originallyOwed > 0 ? Math.min(100, (collected / originallyOwed) * 100) : 0;

  return {
    originallyOwed,
    collected,
    outstanding,
    collectionPercent,
  };
}

export function calculateMonthlyActivity(
  debts: Debt[],
  payments: Payment[],
  months = 6,
): MonthlyActivityItem[] {
  const now = new Date();
  const items: MonthlyActivityItem[] = [];

  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-US', { month: 'short' });

    const debtsCreated = debts.filter((debt) => debt.createdAt.startsWith(key)).length;
    const paymentsRecorded = payments.filter((payment) => payment.date.startsWith(key)).length;

    items.push({
      key,
      label,
      debtsCreated,
      paymentsRecorded,
    });
  }

  return items;
}

export function calculateCategoryBreakdown(debts: Debt[]): CategoryBreakdownItem[] {
  const totals = new Map<DebtCategory, number>();

  for (const debt of debts) {
    const remaining = calculateDebtRemaining(debt);
    if (remaining <= 0) {
      continue;
    }
    totals.set(debt.category, (totals.get(debt.category) ?? 0) + remaining);
  }

  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function calculateDebtHealth(debts: Debt[]): DebtHealthSummary {
  const summary: DebtHealthSummary = {
    active: 0,
    overdue: 0,
    partiallyPaid: 0,
    paid: 0,
  };

  for (const debt of debts) {
    const status = getDebtStatus(debt);
    if (status === 'PAID') summary.paid += 1;
    else if (status === 'OVERDUE') summary.overdue += 1;
    else if (status === 'PARTIALLY_PAID') summary.partiallyPaid += 1;
    else summary.active += 1;
  }

  return summary;
}

export function countActiveDebts(debts: Debt[]): number {
  return debts.filter((debt) => calculateDebtRemaining(debt) > 0).length;
}

export function countOwedToMeDebts(debts: Debt[]): number {
  return debts.filter(
    (debt) => debt.direction === 'THEY_OWE_ME' && calculateDebtRemaining(debt) > 0,
  ).length;
}

export type DueUrgency = 'overdue' | 'soon' | 'upcoming';

export function getDueUrgency(debt: Debt, now = new Date()): DueUrgency | null {
  const remaining = calculateDebtRemaining(debt);
  if (remaining <= 0 || !debt.dueDate) {
    return null;
  }

  const status = getDebtStatus(debt, now);
  if (status === 'OVERDUE') {
    return 'overdue';
  }

  const due = new Date(debt.dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) {
    return 'soon';
  }

  return 'upcoming';
}
