'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils/cn';

export interface PaginationProps {
  page: number;          // 1-indexed
  pageCount: number;
  onPageChange: (next: number) => void;
  /** Optional total label, e.g. "of 1,204 records". */
  total?: number;
  className?: string;
}

export function Pagination({ page, pageCount, onPageChange, total, className }: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < pageCount;
  return (
    <div className={cn('flex items-center justify-between gap-3 text-sm', className)}>
      <p className="text-xs text-fg-subtle">
        Page <span className="font-medium text-fg">{page}</span> of{' '}
        <span className="font-medium text-fg">{Math.max(pageCount, 1)}</span>
        {total !== undefined && <> · {total.toLocaleString()} total</>}
      </p>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          leftIcon={<ChevronLeft size={14} />}
        >
          Prev
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          rightIcon={<ChevronRight size={14} />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
