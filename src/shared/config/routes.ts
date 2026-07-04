export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  users: '/users',
  userDetail: '/users/:customerId',
  merchants: '/merchants',
  merchantDetail: '/merchants/:merchantId',
  staff: '/staff',
  services: '/services',
  packages: '/packages',
  bookings: '/bookings',
  calendar: '/calendar',
  payments: '/payments',
  promotions: '/promotions',
  reviews: '/reviews',
  messaging: '/messaging',
  notifications: '/notifications',
  loyalty: '/loyalty',
  media: '/media',
  reports: '/reports',
  settings: '/settings',
  roles: '/roles',
  auditLogs: '/audit-logs',
  permissionDenied: '/permission-denied',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export function userDetailPath(customerId: string): string {
  return `/users/${customerId}`;
}

export function shopDetailPath(merchantId: string): string {
  return `/merchants/${merchantId}`;
}
