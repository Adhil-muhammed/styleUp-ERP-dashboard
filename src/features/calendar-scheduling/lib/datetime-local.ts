/** Converts ISO string to `datetime-local` input value in local timezone. */
export function toDatetimeLocal(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

/** Converts `datetime-local` input value to ISO string. */
export function fromDatetimeLocal(value: string): string {
  return new Date(value).toISOString();
}
