const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-IN');

export function formatInr(value: number): string {
  return inrFormatter.format(value);
}

export function formatInrCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  }
  if (abs >= 100_000) {
    return `₹${(value / 100_000).toFixed(1)}L`;
  }
  if (abs >= 1_000) {
    return `₹${Math.round(value / 1_000)}K`;
  }
  return inrFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}
