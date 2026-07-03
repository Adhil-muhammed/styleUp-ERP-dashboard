import type React from 'react';
import { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import {
  AuditLogsPage,
  BookingManagementPage,
  CalendarSchedulingPage,
  DashboardPage,
  LoyaltyPage,
  MediaLibraryPage,
  MerchantManagementPage,
  MessagingPage,
  NotificationsPage,
  PackageManagementPage,
  PaymentsPage,
  PromotionsPage,
  ReportsAnalyticsPage,
  ReviewsPage,
  RolePermissionPage,
  ServiceCatalogPage,
  StaffManagementPage,
  SystemConfigurationPage,
  UserManagementPage,
} from '@/app/lazy-pages';
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { PermissionDeniedPage } from '@/app/pages/PermissionDeniedPage';
import { AppShell } from '@/shared/components/layout/AppShell';
import { PageLoader } from '@/shared/components/loading/PageLoader';
import { ROUTES } from '@/shared/config/routes';

function withSuspense(element: React.ReactElement): React.ReactElement {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={ROUTES.dashboard} replace /> },
      { path: ROUTES.dashboard, element: withSuspense(<DashboardPage />) },
      { path: ROUTES.users, element: withSuspense(<UserManagementPage />) },
      { path: ROUTES.merchants, element: withSuspense(<MerchantManagementPage />) },
      { path: ROUTES.staff, element: withSuspense(<StaffManagementPage />) },
      { path: ROUTES.services, element: withSuspense(<ServiceCatalogPage />) },
      { path: ROUTES.packages, element: withSuspense(<PackageManagementPage />) },
      { path: ROUTES.bookings, element: withSuspense(<BookingManagementPage />) },
      { path: ROUTES.calendar, element: withSuspense(<CalendarSchedulingPage />) },
      { path: ROUTES.payments, element: withSuspense(<PaymentsPage />) },
      { path: ROUTES.promotions, element: withSuspense(<PromotionsPage />) },
      { path: ROUTES.reviews, element: withSuspense(<ReviewsPage />) },
      { path: ROUTES.messaging, element: withSuspense(<MessagingPage />) },
      { path: ROUTES.notifications, element: withSuspense(<NotificationsPage />) },
      { path: ROUTES.loyalty, element: withSuspense(<LoyaltyPage />) },
      { path: ROUTES.media, element: withSuspense(<MediaLibraryPage />) },
      { path: ROUTES.reports, element: withSuspense(<ReportsAnalyticsPage />) },
      { path: ROUTES.settings, element: withSuspense(<SystemConfigurationPage />) },
      { path: ROUTES.roles, element: withSuspense(<RolePermissionPage />) },
      { path: ROUTES.auditLogs, element: withSuspense(<AuditLogsPage />) },
    ],
  },
  { path: ROUTES.permissionDenied, element: <PermissionDeniedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
