'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils/misc';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React from 'react';
import { Button } from '../atoms/button';

type PaginationProps = {
  page: number;
  limit: number;
  totalItems: number;
  siblingCount?: number;
};

function getPaginationRange({
  page,
  limit,
  totalItems,
  siblingCount = 1,
}: {
  page: number;
  limit: number;
  totalItems: number;
  siblingCount?: number;
}): (number | '...')[] {
  const totalPages = Math.ceil(totalItems / limit);
  const totalNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const range = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
    return [...range, '...', totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const range = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + i + 1
    );
    return [1, '...', ...range];
  }

  const range = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [1, '...', ...range, '...', totalPages];
}

const EllipsisPagination: React.FC<PaginationProps> = ({
  page,
  limit,
  totalItems,
  siblingCount = 1,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / limit);

  const paginationRange = getPaginationRange({
    page,
    limit,
    totalItems,
    siblingCount,
  });

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={'outline'}
        size={'icon'}
        onClick={() => changePage(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeftIcon size={18} />
      </Button>

      {paginationRange.map((item, idx) =>
        item === '...' ? (
          <span key={idx} className="text-muted-foreground px-2">
            ...
          </span>
        ) : (
          <Button
            key={idx}
            variant={item === page ? 'default' : 'ghost'}
            onClick={() => changePage(item)}
            className={cn(item === page ? 'pointer-events-none' : '')}
          >
            {item}
          </Button>
        )
      )}

      <Button
        variant={'outline'}
        size={'icon'}
        onClick={() => changePage(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRightIcon size={18} />
      </Button>
    </div>
  );
};

export { EllipsisPagination };
