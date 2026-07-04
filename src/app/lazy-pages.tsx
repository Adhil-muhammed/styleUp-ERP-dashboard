import { lazy } from 'react';

export const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((module) => ({ default: module.DashboardPage })),
);
export const UserManagementPage = lazy(() =>
  import('@/features/user-management').then((module) => ({ default: module.UserManagementPage })),
);
export const CustomerProfilePage = lazy(() =>
  import('@/features/user-management').then((module) => ({ default: module.CustomerProfilePage })),
);
export const MerchantManagementPage = lazy(() =>
  import('@/features/merchant-management').then((module) => ({
    default: module.MerchantManagementPage,
  })),
);
export const StaffManagementPage = lazy(() =>
  import('@/features/staff-management').then((module) => ({ default: module.StaffManagementPage })),
);
export const ServiceCatalogPage = lazy(() =>
  import('@/features/service-catalog').then((module) => ({ default: module.ServiceCatalogPage })),
);
export const PackageManagementPage = lazy(() =>
  import('@/features/package-management').then((module) => ({
    default: module.PackageManagementPage,
  })),
);
export const BookingManagementPage = lazy(() =>
  import('@/features/booking-management').then((module) => ({
    default: module.BookingManagementPage,
  })),
);
export const CalendarSchedulingPage = lazy(() =>
  import('@/features/calendar-scheduling').then((module) => ({
    default: module.CalendarSchedulingPage,
  })),
);
export const PaymentsPage = lazy(() =>
  import('@/features/payments').then((module) => ({ default: module.PaymentsPage })),
);
export const PromotionsPage = lazy(() =>
  import('@/features/promotions').then((module) => ({ default: module.PromotionsPage })),
);
export const ReviewsPage = lazy(() =>
  import('@/features/reviews').then((module) => ({ default: module.ReviewsPage })),
);
export const MessagingPage = lazy(() =>
  import('@/features/messaging').then((module) => ({ default: module.MessagingPage })),
);
export const NotificationsPage = lazy(() =>
  import('@/features/notifications').then((module) => ({ default: module.NotificationsPage })),
);
export const LoyaltyPage = lazy(() =>
  import('@/features/loyalty').then((module) => ({ default: module.LoyaltyPage })),
);
export const MediaLibraryPage = lazy(() =>
  import('@/features/media-library').then((module) => ({ default: module.MediaLibraryPage })),
);
export const ReportsAnalyticsPage = lazy(() =>
  import('@/features/reports-analytics').then((module) => ({
    default: module.ReportsAnalyticsPage,
  })),
);
export const SystemConfigurationPage = lazy(() =>
  import('@/features/system-configuration').then((module) => ({
    default: module.SystemConfigurationPage,
  })),
);
export const RolePermissionPage = lazy(() =>
  import('@/features/role-permission').then((module) => ({ default: module.RolePermissionPage })),
);
export const AuditLogsPage = lazy(() =>
  import('@/features/audit-logs').then((module) => ({ default: module.AuditLogsPage })),
);
