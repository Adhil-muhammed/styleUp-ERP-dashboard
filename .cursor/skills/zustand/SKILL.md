---
name: zustand
description: Zustand v5 store creation, selectors, and client-state boundaries for StyleUp ERP
---

# Zustand

> Verify against https://zustand.docs.pmnd.rs/ before relying on this for a new minor/major upgrade — last verified against **zustand@5.0.14** on 2026-07-04.

## Version pinned

| Package | Version |
|---------|---------|
| `zustand` | 5.0.14 |

## Core concepts (v5)

- Minimal global state — hook-based store, no Provider required (unless combining with context).
- **`create<T>()((set, get) => ({ ... }))`** — curried generic syntax in v5 for TypeScript inference.
- **Immutable updates** via `set({ ... })` or functional `set((state) => ({ ... }))`.
- **No middleware required** for basic stores; persist/devtools available as optional middleware.

## Project reference store

[`src/shared/lib/merchant-store.ts`](../../src/shared/lib/merchant-store.ts):

```ts
import { create } from 'zustand';

type MerchantState = {
  merchantId: string | null;
  setMerchantId: (merchantId: string | null) => void;
  clearMerchantId: () => void;
};

export const useMerchantStore = create<MerchantState>((set) => ({
  merchantId: null,
  setMerchantId: (merchantId) => set({ merchantId }),
  clearMerchantId: () => set({ merchantId: null }),
}));
```

Context wrapper [`merchant-context.tsx`](../../src/shared/lib/merchant-context.tsx) reads store for React tree injection.

## Selectors (minimize re-renders)

```tsx
// Good — subscribes to merchantId only
const merchantId = useMerchantStore((s) => s.merchantId);

// Avoid — re-renders on any store change
const store = useMerchantStore();
```

## When to use Zustand vs TanStack Query

| Concern | Tool |
|---------|------|
| API data, lists, details | TanStack Query |
| Sidebar open/closed | Zustand or local `useState` |
| Active merchant scope | Zustand (`merchant-store`) |
| Theme preference | Zustand or context (`theme-provider`) |
| Form draft state | react-hook-form local state |
| URL-reflected state | React Router search params |

Zustand holds **client/UI/cross-cutting** state. TanStack Query owns **server** state — never duplicate API responses in Zustand.

## Adding a new store

One store per concern; colocate in `src/shared/lib/` if cross-feature, or feature folder if feature-local UI:

```ts
type SidebarState = {
  isOpen: boolean;
  toggle: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
```

## Common mistakes

- Caching API responses in Zustand (stale vs Query cache divergence)
- Subscribing to entire store without selectors
- Using Zustand for data TanStack Query already fetches
- One mega-store for all UI state (prefer focused stores)

## Breaking changes (v4 → v5)

- `create<T>()(...)` curried call signature for improved TS inference
- React 18+ minimum; works with React 19 in this project

## Official docs

- https://zustand.docs.pmnd.rs/getting-started/introduction
- https://zustand.docs.pmnd.rs/guides/typescript
- https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-use-shallow
