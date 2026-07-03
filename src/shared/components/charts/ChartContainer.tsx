import type { ReactNode } from 'react';

export type ChartContainerProps = {
  children?: ReactNode;
  title?: string;
};

export function ChartContainer({ children, title }: ChartContainerProps): React.ReactElement {
  return (
    <section data-testid="chart-container">
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}
