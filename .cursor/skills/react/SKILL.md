---
name: react
description: React 19 patterns for StyleUp ERP — refs, Suspense/lazy, component conventions
---

# React

> Verify against https://react.dev/ before relying on this for a new minor/major upgrade — last verified against **react@19.2.7** on 2026-07-04.

## Version pinned

| Package | Version |
|---------|---------|
| `react` | 19.2.7 |
| `react-dom` | 19.2.7 |
| `@types/react` | 19.2.17 |
| `@types/react-dom` | 19.2.3 |

## Core concepts (React 19)

- **`ref` as a prop:** Pass `ref` directly to function components — `forwardRef` is deprecated (still works for migration). Prefer plain `ref` prop on new components.
- **`use()` hook:** Reads promises or context in render; can suspend. **Not used** in current scaffold — TanStack Query + Suspense cover async UI.
- **New JSX transform:** `jsx: "react-jsx"` in tsconfig — no `import React from 'react'` required for JSX, but explicit imports still used for types/hooks.
- **StrictMode:** Enabled in [`src/main.tsx`](../../src/main.tsx) — double-invokes effects in dev only.

## Project component patterns

- Function components only; class components limited to [`ErrorBoundary`](../../src/shared/components/error-boundary/ErrorBoundary.tsx).
- Named exports for components/hooks; default export only for [`App.tsx`](../../src/app/App.tsx) and lazy-wrapped page modules.
- Return type: `React.ReactElement` (global `JSX` namespace unavailable when tsconfig restricts `types`).
- Props: `interface ComponentNameProps` for 3+ props.

## Suspense + lazy loading

Lazy definitions live in [`src/app/lazy-pages.tsx`](../../src/app/lazy-pages.tsx):

```tsx
export const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((module) => ({ default: module.DashboardPage })),
);
```

Feature barrels use **named exports**; `React.lazy` requires default — map in `.then()`.

Router wraps lazy routes in [`src/app/router.tsx`](../../src/app/router.tsx):

```tsx
function withSuspense(element: React.ReactElement): React.ReactElement {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}
```

## Provider tree

[`src/app/providers.tsx`](../../src/app/providers.tsx): QueryClient → i18n → CASL → Merchant → Theme → children.

## Ref pattern (React 19)

```tsx
// Preferred — ref as prop
function TextInput({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> } & InputHTMLAttributes<HTMLInputElement>) {
  return <input ref={ref} {...props} />;
}

// Legacy — avoid for new code
const TextInput = forwardRef<HTMLInputElement, Props>(...);
```

shadcn Button uses `radix-ui` Slot — follows current library patterns.

## Common mistakes

- Creating new `forwardRef` wrappers (deprecated habit from React 18)
- Missing or unstable `key` on list items (use entity `id`, not index)
- Stale closures in `useEffect` from missing deps
- Fetching in `useEffect` instead of TanStack Query
- Business logic inline in JSX instead of hooks/helpers above return

## Breaking changes (React 18 → 19)

- `ref` is a regular prop on function components
- `forwardRef` deprecated
- Stricter ref cleanup in callback refs
- Requires new JSX transform (already configured)

## Official docs

- https://react.dev/
- https://react.dev/reference/react/lazy
- https://react.dev/reference/react/forwardRef
