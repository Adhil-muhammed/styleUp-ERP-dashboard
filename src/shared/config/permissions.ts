export const PERMISSIONS = {
  dashboard: {
    view: 'dashboard:view',
  },
  users: {
    view: 'users:view',
    manage: 'users:manage',
  },
  merchants: {
    view: 'merchants:view',
    manage: 'merchants:manage',
  },
  staff: {
    view: 'staff:view',
    manage: 'staff:manage',
  },
  services: {
    view: 'services:view',
    manage: 'services:manage',
  },
  packages: {
    view: 'packages:view',
    manage: 'packages:manage',
  },
  bookings: {
    view: 'bookings:view',
    manage: 'bookings:manage',
  },
  calendar: {
    view: 'calendar:view',
    manage: 'calendar:manage',
  },
  payments: {
    view: 'payments:view',
    manage: 'payments:manage',
  },
  promotions: {
    view: 'promotions:view',
    manage: 'promotions:manage',
  },
  reviews: {
    view: 'reviews:view',
    manage: 'reviews:manage',
  },
  messaging: {
    view: 'messaging:view',
    manage: 'messaging:manage',
  },
  notifications: {
    view: 'notifications:view',
    manage: 'notifications:manage',
  },
  loyalty: {
    view: 'loyalty:view',
    manage: 'loyalty:manage',
  },
  media: {
    view: 'media:view',
    manage: 'media:manage',
  },
  reports: {
    view: 'reports:view',
  },
  settings: {
    view: 'settings:view',
    manage: 'settings:manage',
  },
  roles: {
    view: 'roles:view',
    manage: 'roles:manage',
  },
  auditLogs: {
    view: 'audit-logs:view',
  },
} as const;
