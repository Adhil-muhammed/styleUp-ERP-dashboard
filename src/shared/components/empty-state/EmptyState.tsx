import type React from 'react';
export type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps): React.ReactElement {
  return (
    <div data-testid="empty-state">
      {title ? <h3>{title}</h3> : null}
      {description ? <p>{description}</p> : null}
    </div>
  );
}
