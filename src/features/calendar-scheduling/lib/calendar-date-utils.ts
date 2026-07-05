import { addMinutes, parseISO } from 'date-fns';

export function addMinutesToIso(iso: string, minutes: number): string {
  return addMinutes(parseISO(iso), minutes).toISOString();
}

export function overlapsRange(
  start: string,
  end: string,
  rangeStart: string,
  rangeEnd: string,
): boolean {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const rs = new Date(rangeStart).getTime();
  const re = new Date(rangeEnd).getTime();
  return s < re && e > rs;
}

export function eachDateInRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = new Date(from);
  current.setUTCHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setUTCHours(0, 0, 0, 0);
  while (current.getTime() <= end.getTime()) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

export function parseEventId(compositeId: string): { kind: string; entityId: string } {
  const [kind, ...rest] = compositeId.split(':');
  return { kind: kind ?? 'booking', entityId: rest.join(':') };
}

export function makeEventId(kind: string, entityId: string): string {
  return `${kind}:${entityId}`;
}
