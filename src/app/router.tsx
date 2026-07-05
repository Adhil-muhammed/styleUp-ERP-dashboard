import type React from 'react';
import { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import {
  AuditLogsPage,
  BookingManagementPage,
  CalendarSchedulingPage,
  CustomerProfilePage,
  DashboardPage,
  LoginPage,
  LoyaltyPage,
  MediaLibraryPage,
  MerchantManagementPage,
  MerchantProfilePage,
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
  StaffProfilePage,
  SystemConfigurationPage,
  UserManagementPage,
} from '@/app/lazy-pages';
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { PermissionDeniedPage } from '@/app/pages/PermissionDeniedPage';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { RequirePermission } from '@/app/guards/RequirePermission';
import { AppShell } from '@/shared/components/layout/AppShell';
import { PageLoader } from '@/shared/components/loading/PageLoader';
import { PERMISSIONS } from '@/shared/config/permissions';
import { ROUTES } from '@/shared/config/routes';

function withSuspense(element: React.ReactElement): React.ReactElement {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

function withPermission(
  action: string,
  subject: string,
  element: React.ReactElement,
): React.ReactElement {
  return withSuspense(
    <RequirePermission action={action} subject={subject}>
      {element}
    </RequirePermission>,
  );
}

export const router = createBrowserRouter([
  {
    path: ROUTES.login,
    element: withSuspense(<LoginPage />),
  },
  {
    path: ROUTES.home,
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.dashboard} replace /> },
      {
        path: ROUTES.dashboard,
        element: withPermission('view', PERMISSIONS.dashboard.view, <DashboardPage />),
      },
      {
        path: ROUTES.users,
        element: withPermission('view', PERMISSIONS.users.view, <UserManagementPage />),
      },
      {
        path: ROUTES.userDetail,
        element: withPermission('view', PERMISSIONS.users.view, <CustomerProfilePage />),
      },
      {
        path: ROUTES.merchants,
        element: withPermission('view', PERMISSIONS.merchants.view, <MerchantManagementPage />),
      },
      {
        path: ROUTES.merchantDetail,
        element: withPermission('view', PERMISSIONS.merchants.view, <MerchantProfilePage />),
      },
      {
        path: ROUTES.staff,
        element: withPermission('view', PERMISSIONS.staff.view, <StaffManagementPage />),
      },
      {
        path: ROUTES.staffDetail,
        element: withPermission('view', PERMISSIONS.staff.view, <StaffProfilePage />),
      },
      {
        path: ROUTES.services,
        element: withPermission('view', PERMISSIONS.services.view, <ServiceCatalogPage />),
      },
      {
        path: ROUTES.packages,
        element: withPermission('view', PERMISSIONS.packages.view, <PackageManagementPage />),
      },
      {
        path: ROUTES.bookings,
        element: withPermission('view', PERMISSIONS.bookings.view, <BookingManagementPage />),
      },
      {
        path: ROUTES.calendar,
        element: withPermission('view', PERMISSIONS.calendar.view, <CalendarSchedulingPage />),
      },
      {
        path: ROUTES.payments,
        element: withPermission('view', PERMISSIONS.payments.view, <PaymentsPage />),
      },
      {
        path: ROUTES.promotions,
        element: withPermission('view', PERMISSIONS.promotions.view, <PromotionsPage />),
      },
      {
        path: ROUTES.reviews,
        element: withPermission('view', PERMISSIONS.reviews.view, <ReviewsPage />),
      },
      {
        path: ROUTES.messaging,
        element: withPermission('view', PERMISSIONS.messaging.view, <MessagingPage />),
      },
      {
        path: ROUTES.notifications,
        element: withPermission('view', PERMISSIONS.notifications.view, <NotificationsPage />),
      },
      {
        path: ROUTES.loyalty,
        element: withPermission('view', PERMISSIONS.loyalty.view, <LoyaltyPage />),
      },
      {
        path: ROUTES.media,
        element: withPermission('view', PERMISSIONS.media.view, <MediaLibraryPage />),
      },
      {
        path: ROUTES.reports,
        element: withPermission('view', PERMISSIONS.reports.view, <ReportsAnalyticsPage />),
      },
      {
        path: ROUTES.settings,
        element: withPermission('view', PERMISSIONS.settings.view, <SystemConfigurationPage />),
      },
      {
        path: ROUTES.roles,
        element: withPermission('view', PERMISSIONS.roles.view, <RolePermissionPage />),
      },
      {
        path: ROUTES.auditLogs,
        element: withPermission('view', PERMISSIONS.auditLogs.view, <AuditLogsPage />),
      },
    ],
  },
  { path: ROUTES.permissionDenied, element: <PermissionDeniedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
