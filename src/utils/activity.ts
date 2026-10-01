import type { LucideIcon } from 'lucide-react-native';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  FileText,
} from 'lucide-react-native';

import type { Debt } from '@/types/debt';
import type { Payment } from '@/types/payment';
import type { Person } from '@/types/person';
import { formatCurrency } from '@/utils/format';
import { calculateDebtRemaining } from '@/utils/finance';

export type ActivityType = 'debt_created' | 'payment_recorded' | 'debt_paid';

export interface ActivityItem {
  id: string;
  date: string;
  label: string;
  amount?: string;
  debtId: string;
  type: ActivityType;
  icon: LucideIcon;
}

export function buildRecentActivity(
  debts: Debt[],
  payments: Payment[],
  people: Person[],
  currency: string,
): ActivityItem[] {
  const personMap = new Map(people.map((person) => [person.id, person.name]));
  const items: ActivityItem[] = [];

  for (const debt of debts) {
    const name = personMap.get(debt.personId) ?? 'Someone';
    const remaining = calculateDebtRemaining(debt);

    if (remaining === 0 && debt.amountPaid > 0) {
      items.push({
        id: `paid-${debt.id}`,
        date: debt.updatedAt,
        label: `${name}'s debt was marked paid`,
        amount: formatCurrency(debt.originalAmount, currency),
        debtId: debt.id,
        type: 'debt_paid',
        icon: CheckCircle2,
      });
    } else if (debt.direction === 'THEY_OWE_ME') {
      items.push({
        id: `debt-${debt.id}`,
        date: debt.createdAt,
        label: `${name} owes you`,
        amount: formatCurrency(debt.originalAmount, currency),
        debtId: debt.id,
        type: 'debt_created',
        icon: ArrowDownLeft,
      });
    } else {
      items.push({
        id: `debt-${debt.id}`,
        date: debt.createdAt,
        label: `You owe ${name}`,
        amount: formatCurrency(debt.originalAmount, currency),
        debtId: debt.id,
        type: 'debt_created',
        icon: ArrowUpRight,
      });
    }
  }

  for (const payment of payments) {
    const debt = debts.find((item) => item.id === payment.debtId);
    if (!debt) {
      continue;
    }

    const name = personMap.get(debt.personId) ?? 'Someone';
    const amount = formatCurrency(payment.amount, payment.currency || currency);

    if (debt.direction === 'THEY_OWE_ME') {
      items.push({
        id: `payment-${payment.id}`,
        date: payment.date,
        label: `${name} paid you`,
        amount,
        debtId: debt.id,
        type: 'payment_recorded',
        icon: ArrowDownLeft,
      });
    } else {
      items.push({
        id: `payment-${payment.id}`,
        date: payment.date,
        label: `You paid ${name}`,
        amount,
        debtId: debt.id,
        type: 'payment_recorded',
        icon: ArrowUpRight,
      });
    }
  }

  return items
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
}
