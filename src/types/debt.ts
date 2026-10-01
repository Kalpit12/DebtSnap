export type DebtDirection = 'THEY_OWE_ME' | 'I_OWE';

export type DebtCategory =
  | 'PERSONAL'
  | 'FOOD'
  | 'TRANSPORT'
  | 'SHOPPING'
  | 'BILLS'
  | 'BUSINESS'
  | 'OTHER';

export type DebtStatus = 'ACTIVE' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';

export interface Debt {
  id: string;
  personId: string;
  direction: DebtDirection;
  originalAmount: number;
  amountPaid: number;
  currency: string;
  date: string;
  dueDate?: string;
  category: DebtCategory;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
