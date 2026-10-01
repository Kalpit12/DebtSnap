export interface CurrencyOption {
  code: string;
  label: string;
  symbol: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'KES', label: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
];

export function getCurrencyLabel(code: string): string {
  const match = CURRENCIES.find((item) => item.code === code);
  return match ? `${match.code} — ${match.label}` : code;
}
