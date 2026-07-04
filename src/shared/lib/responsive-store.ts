import { breakpoints } from '@/theme/responsive';

export type BreakpointName = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type DeviceFlags = {
  isBelowSm: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
};

const THROTTLE_MS = 150;
const SSR_DEFAULT_WIDTH = breakpoints.sm - 1;

type Listener = () => void;

let currentWidth = SSR_DEFAULT_WIDTH;
let subscriberCount = 0;
let rafId: number | null = null;
let lastUpdate = 0;
const listeners = new Set<Listener>();

function readWidth(): number {
  if (typeof window === 'undefined') {
    return SSR_DEFAULT_WIDTH;
  }
  return window.innerWidth;
}

function notifyListeners(): void {
  const nextWidth = readWidth();
  if (nextWidth === currentWidth) {
    return;
  }
  currentWidth = nextWidth;
  listeners.forEach((listener) => listener());
}

function handleResize(): void {
  const now = Date.now();
  const elapsed = now - lastUpdate;

  if (elapsed >= THROTTLE_MS) {
    lastUpdate = now;
    notifyListeners();
    return;
  }

  if (rafId !== null) {
    return;
  }

  rafId = window.requestAnimationFrame(() => {
    rafId = null;
    if (Date.now() - lastUpdate >= THROTTLE_MS) {
      lastUpdate = Date.now();
      notifyListeners();
    }
  });
}

function attachResizeListener(): void {
  if (typeof window === 'undefined') {
    return;
  }
  currentWidth = readWidth();
  lastUpdate = Date.now();
  window.addEventListener('resize', handleResize, { passive: true });
}

function detachResizeListener(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.removeEventListener('resize', handleResize);
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
}

export function getBreakpointName(width: number): BreakpointName {
  if (width >= breakpoints['2xl']) {
    return '2xl';
  }
  if (width >= breakpoints.xl) {
    return 'xl';
  }
  if (width >= breakpoints.lg) {
    return 'lg';
  }
  if (width >= breakpoints.md) {
    return 'md';
  }
  if (width >= breakpoints.sm) {
    return 'sm';
  }
  return 'base';
}

export function getDeviceFlags(width: number): DeviceFlags {
  return {
    isBelowSm: width < breakpoints.sm,
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
    isLargeDesktop: width >= breakpoints.xl,
  };
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  subscriberCount += 1;

  if (subscriberCount === 1) {
    attachResizeListener();
  }

  return () => {
    listeners.delete(listener);
    subscriberCount -= 1;

    if (subscriberCount === 0) {
      detachResizeListener();
    }
  };
}

export function getSnapshot(): number {
  if (typeof window !== 'undefined' && subscriberCount === 0) {
    currentWidth = readWidth();
  }
  return currentWidth;
}

export function getServerSnapshot(): number {
  return SSR_DEFAULT_WIDTH;
}
