import type { DebtStatus } from '@/types/debt';

export const DEBT_STATUS_LABELS: Record<DebtStatus, string> = {
  ACTIVE: 'Active',
  PARTIALLY_PAID: 'Partially paid',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
};
