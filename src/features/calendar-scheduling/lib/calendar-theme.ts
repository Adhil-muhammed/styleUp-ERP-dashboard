import type { CalendarProps } from 'calendarkit-basic';

export type CalendarTheme = NonNullable<CalendarProps['theme']>;

function readCssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** Maps shadcn CSS variables to CalendarKit theme tokens. */
export function getCalendarKitTheme(isDark: boolean): CalendarTheme {
  return {
    colors: {
      primary: readCssVar('--primary', isDark ? '#e5e5e5' : '#171717'),
      secondary: readCssVar('--secondary', isDark ? '#262626' : '#f5f5f5'),
      background: readCssVar('--background', isDark ? '#0a0a0a' : '#ffffff'),
      foreground: readCssVar('--foreground', isDark ? '#fafafa' : '#0a0a0a'),
      border: readCssVar('--border', isDark ? '#262626' : '#e5e5e5'),
      muted: readCssVar('--muted', isDark ? '#262626' : '#f5f5f5'),
      accent: readCssVar('--accent', isDark ? '#262626' : '#f5f5f5'),
    },
    fontFamily: 'var(--font-sans, Geist, ui-sans-serif, system-ui, sans-serif)',
    borderRadius: '0.5rem',
  };
}
