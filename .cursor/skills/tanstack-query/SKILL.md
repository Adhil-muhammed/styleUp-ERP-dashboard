---
name: tanstack-query
description: TanStack Query v5 hooks, query keys, cache invalidation for StyleUp ERP
---

# TanStack Query

> Verify against https://tanstack.com/query/latest before relying on this for a new minor/major upgrade — last verified against **@tanstack/react-query@5.101.2** on 2026-07-04.

## Version pinned

| Package | Version |
|---------|---------|
| `@tanstack/react-query` | 5.101.2 |
| `@tanstack/react-query-devtools` | 5.101.2 |

## Core concepts (v5)

- **Server state library** — caching, background refetch, deduplication, stale-while-revalidate.
- **`useQuery`** — read/fetch data; **`useMutation`** — write data; **`useQueryClient`** — imperative cache access.
- **Status flags:** `isPending`, `isError`, `isSuccess`, `isFetching` (queries); mutations use `isPending` (v4 used `isLoading` for mutations — renamed in v5).
- **Query keys:** serializable arrays; identity drives cache entries.

## Project setup

Singleton client [`src/shared/lib/query-client.ts`](../../src/shared/lib/query-client.ts):

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});
```

Provider in [`src/app/providers.tsx`](../../src/app/providers.tsx):

```tsx
<QueryClientProvider client={queryClient}>
  {/* app */}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

Devtools are dev-only bundled; safe to leave in provider tree.

## Query key convention

```ts
['booking-management', 'list', filters]
['booking-management', 'detail', bookingId]
['audit-logs', 'list', { page, pageSize }]
```

- Index 0: feature folder name (kebab-case string)
- Index 1: scope (`list`, `detail`, etc.)
- Remaining: filters/ids (stable, serializable objects)

Feature hooks live in `src/features/<name>/hooks/use-<name>-queries.ts`.
API functions live in `src/features/<name>/api/` — hooks call API, not axios directly.

## Query hook pattern

```ts
export function useBookingListQuery(filters: BookingFilters) {
  return useQuery({
    queryKey: ['booking-management', 'list', filters],
    queryFn: () => getBookings(filters),
  });
}
```

## Mutation + invalidation

```ts
export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-management', 'list'] });
    },
  });
}
```

Prefer `invalidateQueries` over manual cache patches unless implementing optimistic updates with rollback.

## UI state from Query

```tsx
const { data, isPending, isError, error } = useBookingListQuery(filters);

if (isPending) return <PageLoader />;
if (isError) return <EmptyState title={error.message} />;
```

Do not layer parallel `useState` booleans for loading/error on top of Query.

## Common mistakes

- `useEffect` + `fetch` instead of `useQuery`
- Unstable query keys (inline `{}` recreated every render — memoize filters or pass primitives)
- Missing invalidation after mutations
- Storing Query results in Zustand or component state
- Using `isLoading` on mutations (v5: use `isPending`)

## Breaking changes (v4 → v5)

- `@tanstack/react-query` package name (was `react-query`)
- Mutation `isLoading` → `isPending`
- `cacheTime` → `gcTime`

## Official docs

- https://tanstack.com/query/latest/docs/framework/react/overview
- https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
- https://tanstack.com/query/latest/docs/framework/react/guides/mutations
