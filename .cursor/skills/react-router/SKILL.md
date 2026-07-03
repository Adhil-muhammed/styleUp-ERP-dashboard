---
name: react-router
description: React Router v7 data router, lazy routes, and navigation patterns for StyleUp ERP
---

# React Router

> Verify against https://reactrouter.com/ before relying on this for a new minor/major upgrade — last verified against **react-router-dom@7.18.1** on 2026-07-04.

## Version pinned

| Package | Version |
|---------|---------|
| `react-router-dom` | 7.18.1 |

## Core concepts (v7)

- **Data router API:** `createBrowserRouter` + `RouterProvider` — route objects with `element`, `children`, `index`, `path`.
- **This project uses component routes only** — no `loader`/`action` for data fetching. Server data comes from TanStack Query to avoid duplicate fetches and cache fragmentation.
- **Layouts via nesting:** Parent route renders layout with `<Outlet />`; children render in the outlet slot.

## Project wiring

```
main.tsx → App.tsx → Providers → RouterProvider(router)
router.tsx → AppShell (layout) → lazy feature pages
lazy-pages.tsx → React.lazy imports from feature barrels
routes.ts → ROUTES path constants
```

[`src/app/router.tsx`](../../src/app/router.tsx):

```tsx
export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={ROUTES.dashboard} replace /> },
      { path: ROUTES.dashboard, element: withSuspense(<DashboardPage />) },
      // ...
    ],
  },
  { path: ROUTES.permissionDenied, element: <PermissionDeniedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
```

[`src/shared/config/routes.ts`](../../src/shared/config/routes.ts):

```ts
export const ROUTES = {
  dashboard: '/dashboard',
  bookings: '/bookings',
  // ...
} as const;
```

## Lazy loading pattern

1. Add path to `ROUTES`
2. Add `React.lazy` export in [`lazy-pages.tsx`](../../src/app/lazy-pages.tsx)
3. Register route in `router.tsx` with `withSuspense()`

Never eager-import page components into `router.tsx`.

## Navigation

```tsx
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

<Link to={ROUTES.bookings}>Bookings</Link>
navigate(ROUTES.dashboard);
```

## Data fetching boundary

| Layer | Responsibility |
|-------|----------------|
| React Router | URL, layout, navigation, code-splitting |
| TanStack Query | Server state, cache, mutations |

If you add a route `loader`, it will run independently of Query cache — generally avoid unless replacing Query for that route entirely.

## Common mistakes

- Adding `loader`/`action` that duplicates TanStack Query fetches
- Inline path strings (`'/bookings'`) instead of `ROUTES.bookings`
- Eager-importing pages into router (bloats initial bundle)
- Using `BrowserRouter` + `Routes` when project already uses `createBrowserRouter`

## Breaking changes (v6 → v7)

- Package consolidates APIs; `createBrowserRouter` remains primary for data routers
- Future flags from v6 largely stabilized

## Official docs

- https://reactrouter.com/start/framework/routing
- https://reactrouter.com/api/data/createBrowserRouter
