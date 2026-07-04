import { useResponsive } from '@/shared/hooks/use-responsive';

const MAX_WIDTH_PATTERN = /^\(max-width:\s*(\d+)px\)$/;
const MIN_WIDTH_PATTERN = /^\(min-width:\s*(\d+)px\)$/;

export function evaluateMediaQuery(query: string, width: number): boolean {
  const maxMatch = MAX_WIDTH_PATTERN.exec(query.trim());
  if (maxMatch) {
    return width <= Number(maxMatch[1]);
  }

  const minMatch = MIN_WIDTH_PATTERN.exec(query.trim());
  if (minMatch) {
    return width >= Number(minMatch[1]);
  }

  return false;
}

export function useMediaQuery(query: string): boolean {
  const { width } = useResponsive();
  return evaluateMediaQuery(query, width);
}
