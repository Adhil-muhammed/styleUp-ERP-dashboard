import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type React from 'react';

type SidebarContextValue = {
  isOpen: boolean;
  isCollapsed: boolean;
  isTabletExpanded: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleCollapsed: () => void;
  toggleTabletExpanded: () => void;
  collapseTablet: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

type SidebarProviderProps = {
  children: React.ReactNode;
};

export function SidebarProvider({ children }: SidebarProviderProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTabletExpanded, setIsTabletExpanded] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((current) => !current), []);
  const toggleCollapsed = useCallback(() => setIsCollapsed((current) => !current), []);
  const toggleTabletExpanded = useCallback(
    () => setIsTabletExpanded((current) => !current),
    [],
  );
  const collapseTablet = useCallback(() => setIsTabletExpanded(false), []);

  const value = useMemo(
    () => ({
      isOpen,
      isCollapsed,
      isTabletExpanded,
      open,
      close,
      toggle,
      toggleCollapsed,
      toggleTabletExpanded,
      collapseTablet,
    }),
    [
      isOpen,
      isCollapsed,
      isTabletExpanded,
      open,
      close,
      toggle,
      toggleCollapsed,
      toggleTabletExpanded,
      collapseTablet,
    ],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}
