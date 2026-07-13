import { formatInr } from '@/features/dashboard/lib/formatters';

export function formatInrFromPaise(paise: number): string {
  return formatInr(paise / 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}
