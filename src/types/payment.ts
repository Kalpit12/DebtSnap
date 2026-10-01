export type PaymentMethod = 'CASH' | 'MPESA' | 'BANK' | 'CARD' | 'OTHER';

export interface Payment {
  id: string;
  debtId: string;
  amount: number;
  currency: string;
  date: string;
  method: PaymentMethod;
  note?: string;
  createdAt: string;
}
