import { UndrawFaq } from '@/assets/images';
import { cn } from '@/utils/misc';
import Image from 'next/image';
import { type HTMLAttributes } from 'react';

interface ExceptionOverlayProps extends HTMLAttributes<HTMLDivElement> {
  img?: string;
  title: string;
  subtitle?: string;
}

const ExceptionOverlay = ({
  img,
  title,
  subtitle,
  children,
  className,
  ...props
}: ExceptionOverlayProps) => {
  return (
    <div
      className={cn(
        'm-auto flex max-w-sm flex-col items-center justify-center p-8 pt-0 text-center',
        className
      )}
      {...props}
    >
      <Image src={img ?? UndrawFaq} alt="" className="mb-12 max-w-72" />
      <h4 className="typo-h4">{title}</h4>
      <p className="typo-p text-muted-foreground">{subtitle}</p>
      <div className="mt-3 flex flex-wrap gap-3">{children}</div>
    </div>
  );
};

export { ExceptionOverlay };
