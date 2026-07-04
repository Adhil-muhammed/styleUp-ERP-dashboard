import {
  BarChart3,
  Bell,
  Calendar,
  CalendarCheck,
  CreditCard,
  Gift,
  Images,
  LayoutDashboard,
  MessageSquare,
  Package,
  Scissors,
  ScrollText,
  Settings,
  Shield,
  Star,
  Store,
  Tag,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { PERMISSIONS } from '@/shared/config/permissions';
import { ROUTES, type RoutePath } from '@/shared/config/routes';

export type NavBadgeSlot = 'messaging' | 'notifications';

export type NavItemConfig = {
  id: string;
  to: RoutePath;
  icon: LucideIcon;
  labelKey: string;
  permission?: string;
  badgeSlot?: NavBadgeSlot;
};

export type NavGroupConfig = {
  id: string;
  labelKey: string;
  items: NavItemConfig[];
};

export const DASHBOARD_NAV_ITEM: NavItemConfig = {
  id: 'dashboard',
  to: ROUTES.dashboard,
  icon: LayoutDashboard,
  labelKey: 'nav.items.dashboard',
  permission: PERMISSIONS.dashboard.view,
};

export const NAV_GROUPS: NavGroupConfig[] = [
  {
    id: 'operations',
    labelKey: 'nav.groups.operations',
    items: [
      {
        id: 'users',
        to: ROUTES.users,
        icon: Users,
        labelKey: 'nav.items.users',
        permission: PERMISSIONS.users.view,
      },
      {
        id: 'merchants',
        to: ROUTES.merchants,
        icon: Store,
        labelKey: 'nav.items.merchants',
        permission: PERMISSIONS.merchants.view,
      },
      {
        id: 'staff',
        to: ROUTES.staff,
        icon: UserCog,
        labelKey: 'nav.items.staff',
        permission: PERMISSIONS.staff.view,
      },
      {
        id: 'bookings',
        to: ROUTES.bookings,
        icon: CalendarCheck,
        labelKey: 'nav.items.bookings',
        permission: PERMISSIONS.bookings.view,
      },
      {
        id: 'calendar',
        to: ROUTES.calendar,
        icon: Calendar,
        labelKey: 'nav.items.calendar',
        permission: PERMISSIONS.calendar.view,
      },
      {
        id: 'payments',
        to: ROUTES.payments,
        icon: CreditCard,
        labelKey: 'nav.items.payments',
        permission: PERMISSIONS.payments.view,
      },
    ],
  },
  {
    id: 'catalog',
    labelKey: 'nav.groups.catalog',
    items: [
      {
        id: 'services',
        to: ROUTES.services,
        icon: Scissors,
        labelKey: 'nav.items.services',
        permission: PERMISSIONS.services.view,
      },
      {
        id: 'packages',
        to: ROUTES.packages,
        icon: Package,
        labelKey: 'nav.items.packages',
        permission: PERMISSIONS.packages.view,
      },
      {
        id: 'media',
        to: ROUTES.media,
        icon: Images,
        labelKey: 'nav.items.media',
        permission: PERMISSIONS.media.view,
      },
    ],
  },
  {
    id: 'engagement',
    labelKey: 'nav.groups.engagement',
    items: [
      {
        id: 'promotions',
        to: ROUTES.promotions,
        icon: Tag,
        labelKey: 'nav.items.promotions',
        permission: PERMISSIONS.promotions.view,
      },
      {
        id: 'reviews',
        to: ROUTES.reviews,
        icon: Star,
        labelKey: 'nav.items.reviews',
        permission: PERMISSIONS.reviews.view,
      },
      {
        id: 'messaging',
        to: ROUTES.messaging,
        icon: MessageSquare,
        labelKey: 'nav.items.messaging',
        permission: PERMISSIONS.messaging.view,
        badgeSlot: 'messaging',
      },
      {
        id: 'notifications',
        to: ROUTES.notifications,
        icon: Bell,
        labelKey: 'nav.items.notifications',
        permission: PERMISSIONS.notifications.view,
        badgeSlot: 'notifications',
      },
      {
        id: 'loyalty',
        to: ROUTES.loyalty,
        icon: Gift,
        labelKey: 'nav.items.loyalty',
        permission: PERMISSIONS.loyalty.view,
      },
    ],
  },
  {
    id: 'insights',
    labelKey: 'nav.groups.insights',
    items: [
      {
        id: 'reports',
        to: ROUTES.reports,
        icon: BarChart3,
        labelKey: 'nav.items.reports',
        permission: PERMISSIONS.reports.view,
      },
      {
        id: 'auditLogs',
        to: ROUTES.auditLogs,
        icon: ScrollText,
        labelKey: 'nav.items.auditLogs',
        permission: PERMISSIONS.auditLogs.view,
      },
    ],
  },
  {
    id: 'admin',
    labelKey: 'nav.groups.admin',
    items: [
      {
        id: 'settings',
        to: ROUTES.settings,
        icon: Settings,
        labelKey: 'nav.items.settings',
        permission: PERMISSIONS.settings.view,
      },
      {
        id: 'roles',
        to: ROUTES.roles,
        icon: Shield,
        labelKey: 'nav.items.roles',
        permission: PERMISSIONS.roles.view,
      },
    ],
  },
];

export function isNavItemActive(pathname: string, to: RoutePath): boolean {
  if (to === ROUTES.dashboard) {
    return pathname === to;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}
