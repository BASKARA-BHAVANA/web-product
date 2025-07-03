import { cn } from '@/utils/misc';
import { HTMLProps, ReactNode } from 'react';

interface StackBoxProps {
  className?: string;
  children?: ReactNode;
}

export const ListTile = ({ className, children }: StackBoxProps) => {
  return (
    <div
      className={cn(
        'flex flex-col [&>*]:border-b [&>*:last-child]:border-none',
        className
      )}
    >
      {children}
    </div>
  );
};

interface StackItemProps extends HTMLProps<HTMLDivElement> {
  title: string;
  subtitle?: string;
  slotLeft?: ReactNode;
  slotRight?: ReactNode;
}

export const ListTileItem = ({
  title,
  subtitle,
  slotLeft,
  slotRight,
  className,
  ...divProps
}: StackItemProps) => {
  return (
    <div className={cn('flex items-center gap-4 p-4', className)} {...divProps}>
      {slotLeft}
      <div className="grow">
        <h4 className="typo-large">{title}</h4>
        <h4 className="typo-muted">{subtitle}</h4>
      </div>
      {slotRight}
    </div>
  );
};
