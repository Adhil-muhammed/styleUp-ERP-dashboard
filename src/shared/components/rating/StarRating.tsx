import { Star } from 'lucide-react';
import type React from 'react';

import { cn } from '@/shared/lib/utils';

export type StarRatingProps = {
  value: number;
  size?: 'sm' | 'md';
  showValue?: boolean;
  className?: string;
};

export function StarRating({
  value,
  size = 'md',
  showValue = false,
  className,
}: StarRatingProps): React.ReactElement {
  const clamped = Math.max(0, Math.min(5, value));
  const starSize = size === 'sm' ? 'size-3.5' : 'size-4';

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)} data-testid="star-rating">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = clamped >= index + 1;
        const half = !filled && clamped >= index + 0.5;
        return (
          <Star
            key={index}
            className={cn(
              starSize,
              filled || half ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40',
            )}
          />
        );
      })}
      {showValue ? (
        <span className="ml-1 text-sm tabular-nums text-muted-foreground">
          {clamped.toFixed(1)}
        </span>
      ) : null}
    </div>
  );
}
