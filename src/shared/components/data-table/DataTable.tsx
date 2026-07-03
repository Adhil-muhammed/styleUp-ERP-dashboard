import type React from 'react';
import type { ColumnDef } from '@tanstack/react-table';

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
};

export function DataTable<TData>(_props: DataTableProps<TData>): React.ReactElement {
  return <div data-testid="data-table" />;
}
