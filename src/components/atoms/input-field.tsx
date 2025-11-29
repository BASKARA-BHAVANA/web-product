import { ComponentProps } from 'react';
import { Label } from './label';
import { cn } from '@/utils/misc';

const InputField = ({
  label,
  error,
  hint,
  required,
  children,
  className,
  ...props
}: {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
} & ComponentProps<'div'>) => {
  return (
    <div className={cn('grid items-center gap-3', className)} {...props}>
      {label && (
        <Label>
          {label} {required ? <span className="text-destructive">*</span> : ''}
        </Label>
      )}
      <div>{children}</div>
      {hint && (
        <small className="typo-small text-muted-foreground">{hint}</small>
      )}
      {error && <small className="typo-small text-destructive">{error}</small>}
    </div>
  );
};

export default InputField;
