import * as React from 'react';

import { cn } from '@/utils/misc';
import { Label } from './label';
import { FileIcon } from 'lucide-react';

function Input({
  label,
  error,
  className,
  type,
  usePreview,
  filePreview,
  filePreviewClassName,
  hint,
  accept,
  ...props
}: React.ComponentProps<'input'> & {
  label?: string;
  error?: string;
  hint?: string;
  usePreview?: boolean;
  filePreview?: string;
  filePreviewClassName?: string;
}) {
  return (
    <div className="grid items-center gap-1.5">
      {label && <Label htmlFor={props.name}>{label}</Label>}
      {(type == 'file' || usePreview) && (
        <div
          className={cn(
            'bg-muted flex aspect-square w-full max-w-40 overflow-hidden rounded-sm',
            filePreviewClassName
          )}
        >
          {filePreview ? (
            accept?.startsWith('image/') ? (
              <img src={filePreview} className="size-full object-cover" />
            ) : (
              <iframe src={filePreview} className="size-full object-cover" />
            )
          ) : (
            <FileIcon className="text-muted-foreground m-auto" size={32} />
          )}
        </div>
      )}
      <input
        type={type}
        accept={accept}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        {...props}
      />
      {hint && <small className="text-muted-foreground">{hint}</small>}
      {error && <small className="text-destructive">{error}</small>}
    </div>
  );
}

export { Input };
