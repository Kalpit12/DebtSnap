import type { DebtCategory } from '@/types/debt';

export const DEBT_CATEGORIES: { value: DebtCategory; label: string }[] = [
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'FOOD', label: 'Food' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'BILLS', label: 'Bills' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'OTHER', label: 'Other' },
];

export function getCategoryLabel(category: DebtCategory): string {
  return DEBT_CATEGORIES.find((item) => item.value === category)?.label ?? category;
}
