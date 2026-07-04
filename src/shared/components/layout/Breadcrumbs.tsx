import type React from 'react';
export type BreadcrumbsProps = {
  items?: Array<{ label: string; href?: string }>;
};

export function Breadcrumbs({ items = [] }: BreadcrumbsProps): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb" className="shrink-0 px-6 py-2 text-sm text-muted-foreground">
      {items.length === 0 ? null : items.map((item) => item.label).join(' / ')}
    </nav>
  );
}
