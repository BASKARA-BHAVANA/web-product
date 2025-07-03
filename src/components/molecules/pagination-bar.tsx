'use client';

import { cn } from '@/utils/misc';
import { ComponentProps } from 'react';
import { Button } from '../atoms/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Separator } from '../atoms/separator';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props extends ComponentProps<'div'> {
  count?: number;
  page: number;
  limit: number;
}

const PaginationBar = ({
  count = 10,
  page,
  limit,
  className,
  ...props
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const goToPage = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', targetPage.toString());

    router.push(`?${params.toString()}`);
  };

  const totalPages = count ? Math.ceil(count / limit) : 1;
  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page < totalPages ? page + 1 : totalPages;

  return (
    <div
      className={cn('flex flex-wrap items-center justify-end gap-2', className)}
      {...props}
    >
      <div className="">
        {typeof count == 'number' && (
          <small className="text-small text-muted-foreground">
            Total {count} data
          </small>
        )}
      </div>

      <Separator orientation="vertical" className="mx-4 !h-6" />

      <Button
        variant={'outline'}
        size={'icon'}
        disabled={page <= 1}
        onClick={() => goToPage(prevPage)}
      >
        <ChevronLeftIcon />
      </Button>
      <small className="text-small">
        {page} dari {totalPages}
      </small>
      <Button
        variant={'outline'}
        size={'icon'}
        disabled={page >= totalPages}
        onClick={() => goToPage(nextPage)}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};

export default PaginationBar;
