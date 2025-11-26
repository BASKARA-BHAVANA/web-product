import { cn } from '@/utils/misc';
import React, { ComponentProps } from 'react';

const Headline = ({
  largeTexts,
  headText,
  className,
  ...props
}: {
  largeTexts?: string[];
  headText?: string;
} & ComponentProps<'div'>) => {
  return (
    <div className={cn('flex flex-col items-start', className)} {...props}>
      {largeTexts && largeTexts.length > 0 && (
        <div
          className={cn(
            'bg-primary flex flex-nowrap items-center rounded-t-lg px-3',
            headText ? 'pt-3' : 'py-3'
          )}
        >
          {largeTexts.map((t, i) => (
            <p
              key={i}
              className={cn(
                'typo-large rounded-sm px-2',
                i % 2 == 0 ? 'bg-primary-foreground text-primary' : ''
              )}
            >
              {t}
            </p>
          ))}
        </div>
      )}
      {!!headText && (
        <div
          className={cn(
            'bg-primary flex flex-nowrap items-center rounded-lg rounded-tl-none p-3',
            className?.includes('items-center') ? 'rounded-tl-lg' : '',
            className?.includes('items-end')
              ? 'rounded-tl-lg rounded-tr-none'
              : ''
          )}
        >
          <h1 className="typo-h1">{headText}</h1>
        </div>
      )}
    </div>
  );
};

export default Headline;
