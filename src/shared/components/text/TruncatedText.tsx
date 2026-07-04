import { useEffect, useRef, useState } from 'react';
import type React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

export interface TruncatedTextProps {
  text: string;
  className?: string;
  lines?: 1 | 2;
}

export function TruncatedText({
  text,
  className,
  lines = 1,
}: TruncatedTextProps): React.ReactElement {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) {
      return;
    }

    const checkTruncation = (): void => {
      const truncated =
        lines === 1
          ? element.scrollWidth > element.clientWidth
          : element.scrollHeight > element.clientHeight;
      setIsTruncated(truncated);
    };

    checkTruncation();

    const resizeObserver = new ResizeObserver(checkTruncation);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [text, lines]);

  const textClassName = cn(lines === 1 ? 'truncate' : 'line-clamp-2', className);

  if (!isTruncated) {
    return (
      <span ref={textRef} className={textClassName}>
        {text}
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span ref={textRef} className={cn(textClassName, 'cursor-default')}>
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={4}>{text}</TooltipContent>
    </Tooltip>
  );
}
