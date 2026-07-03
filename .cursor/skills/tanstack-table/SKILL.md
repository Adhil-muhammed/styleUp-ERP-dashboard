---
name: tanstack-table
description: TanStack Table v8 column defs, server pagination, and DataTable wrapper for StyleUp ERP
---

# TanStack Table

> Verify against https://tanstack.com/table/latest before relying on this for a new minor/major upgrade — last verified against **@tanstack/react-table@8.21.3** on 2026-07-04.

## Version pinned

| Package | Version |
|---------|---------|
| `@tanstack/react-table` | 8.21.3 |

## Core concepts (v8)

- **Headless UI** — table logic only; rendering is your JSX (or shared wrapper).
- **`ColumnDef<TData, TValue>`** — column definitions with `accessorKey`, `header`, `cell`.
- **`useReactTable`** — hook wiring data, columns, and state (pagination, sorting, filtering).
- **Framework-agnostic core** — import from `@tanstack/react-table`.

## Project wrapper

[`src/shared/components/data-table/DataTable.tsx`](../../src/shared/components/data-table/DataTable.tsx) (stub to extend):

```tsx
export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
};

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  // useReactTable({ data, columns, ... }) + render
}
```

Extend this wrapper — do not create per-feature raw `<table>` implementations.

## Column definitions (feature-local)

Define in owning feature, e.g. `features/booking-management/components/booking-columns.tsx`:

```tsx
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

export function useBookingColumns(): ColumnDef<BookingRow, unknown>[] {
  return useMemo(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'status', header: 'Status' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <BookingRowActions row={row.original} />,
      },
    ],
    [],
  );
}
```

**Memoize columns** — do not define inline in JSX on every render.

## Server-side pagination (default for large lists)

Pair with TanStack Query:

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
const { data } = useBookingListQuery({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize });

const table = useReactTable({
  data: data?.rows ?? [],
  columns,
  pageCount: data ? Math.ceil(data.total / pagination.pageSize) : 0,
  state: { pagination },
  onPaginationChange: setPagination,
  manualPagination: true,
  getCoreRowModel: getCoreRowModel(),
});
```

Use server pagination for: bookings, audit-logs, payments, users, merchants, notifications.
Client pagination only for small bounded lists (static enums, <50 rows).

## Sorting and filtering

- **Client:** `getSortedRowModel()`, `getFilteredRowModel()` on small datasets
- **Server:** pass sort/filter params into query key + API; set `manualSorting: true`, `manualFiltering: true`

## Row selection

```ts
{ id: 'select', header: ({ table }) => <Checkbox ... />, cell: ({ row }) => <Checkbox ... /> }
// table state: rowSelection, onRowSelectionChange
```

## Common mistakes

- Client-side pagination on unbounded datasets
- Inline column defs without `useMemo` (causes re-renders / lost focus)
- Raw HTML `<table>` bypassing shared `DataTable`
- Putting column defs in `shared/` instead of owning feature

## Breaking changes (v7 → v8)

- API stabilized around `createColumnHelper` optional; `ColumnDef` type is primary
- TanStack Table v8 is the current major for new projects

## Official docs

- https://tanstack.com/table/latest/docs/guide/column-defs
- https://tanstack.com/table/latest/docs/guide/pagination
- https://tanstack.com/table/latest/docs/guide/row-selection
