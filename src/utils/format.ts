import { CURRENCIES } from '@/constants/currencies';

const CURRENCY_LOCALES: Record<string, string> = {
  KES: 'en-KE',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
};

export function getCurrencySymbol(currency: string): string {
  return CURRENCIES.find((item) => item.code === currency)?.symbol ?? currency;
}

export function formatCurrency(amount: number, currency = 'KES'): string {
  const symbol = getCurrencySymbol(currency);
  const locale = CURRENCY_LOCALES[currency] ?? 'en-US';
  const formatted = Math.abs(amount).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (symbol.length > 1) {
    return `${symbol} ${formatted}`;
  }

  return `${symbol}${formatted}`;
}

export function formatSignedCurrency(amount: number, currency = 'KES'): string {
  const prefix = amount > 0 ? '+' : amount < 0 ? '-' : '';
  return `${prefix}${formatCurrency(Math.abs(amount), currency)}`;
}

export function formatDate(date: string | Date): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  return value.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseAmount(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
