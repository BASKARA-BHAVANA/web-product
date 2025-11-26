import { cn } from '@/utils/misc';
import type { ComponentProps, ReactNode } from 'react';

const List = ({
  label,
  boxed,
  className,
  children,
  ...props
}: { label?: string; boxed?: boolean } & ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        '[&>*]:border-base-content/15 flex flex-col overflow-x-auto [&>*:not(:last-child)]:border-b',
        label ? '[&>*:first-child]:border-none' : '',
        boxed ? 'rounded-box border-base-300 border p-4' : '',
        className
      )}
      {...props}
    >
      {label && (
        <small className="typo-small text-base-content/60">{label}</small>
      )}
      {children}
    </div>
  );
};

const ListItem = ({
  title,
  subtitle,
  slotLeft,
  slotRight,
  slotBottom,
  className,
  isLoading,
  ...props
}: {
  title: string;
  subtitle?: string;
  slotLeft?: ReactNode;
  slotRight?: ReactNode;
  slotBottom?: ReactNode;
  isLoading?: boolean;
} & ComponentProps<'div'>) => {
  return (
    <div className={cn('flex items-center gap-3 p-3', className)} {...props}>
      {slotLeft && <div className="pe-3">{slotLeft}</div>}
      <div className="grid grow">
        {isLoading ? (
          <>
            <div className="skeleton mb-3 h-6 w-3/4" />
            <div className="skeleton mb-3 h-4 w-full" />
            <div className="skeleton h-4 w-1/3" />
          </>
        ) : (
          <>
            <p className="typo-p line-clamp-3 font-bold">{title}</p>
            <p className="typo-small text-muted-foreground line-clamp-2">
              {subtitle}
            </p>
            {slotBottom}
          </>
        )}
      </div>
      {slotRight}
    </div>
  );
};

const ListSimpleItem = ({
  label,
  className,
  children,
  ...props
}: { label?: string } & ComponentProps<'div'>) => {
  return (
    <div className={cn('flex items-center gap-2 p-2', className)} {...props}>
      {label && (
        <>
          <p className="typo-p max-w-40 grow">{label}</p>
          <div className="">:</div>
        </>
      )}
      <div className="typo-p">{children}</div>
    </div>
  );
};

const ListSkeleton = ({
  num,
  ...props
}: { num: number } & Partial<ComponentProps<typeof List>>) => {
  return (
    <List {...props}>
      {Array.from({ length: num }).map((_, i) => (
        <ListItem key={i} title="Hello" isLoading />
      ))}
    </List>
  );
};

export { List, ListItem, ListSimpleItem, ListSkeleton };
