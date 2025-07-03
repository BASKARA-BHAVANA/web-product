import * as React from 'react';

import { cn } from '@/utils/misc';
import { Label } from './label';

function Textarea({
  label,
  error,
  className,
  hint,
  ...props
}: React.ComponentProps<'textarea'> & {
  label?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="grid items-center gap-1.5">
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <textarea
        data-slot="textarea"
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        {...props}
      />
      {hint && <small className="text-muted-foreground">{hint}</small>}
      {error && <small className="text-destructive">{error}</small>}
    </div>
  );
}

export { Textarea };
