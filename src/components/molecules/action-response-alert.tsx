import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../atoms/alert';
import { AlertCircleIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/utils/misc';
import {
  ActionFailed,
  ActionResponse,
  ActionSuccess,
} from '@/lib/actions/action-response';

type ActionResponseProps = {
  error: unknown;
} & ComponentProps<typeof Alert>;

const ActionResponseAlert = ({
  error,
  className,
  ...rest
}: ActionResponseProps) => {
  if (!(error instanceof ActionResponse)) return null;

  return (
    <Alert
      variant="destructive"
      className={cn(
        '',
        error instanceof ActionFailed
          ? 'bg-destructive/15 border-destructive/20'
          : '',
        error instanceof ActionSuccess
          ? 'border-green-500/20 bg-green-500/15'
          : '',
        className
      )}
      {...rest}
    >
      <AlertCircleIcon className="mr-2 h-5 w-5" />
      <div>
        <AlertTitle>{error.message}</AlertTitle>
        <AlertDescription></AlertDescription>
      </div>
    </Alert>
  );
};

export default ActionResponseAlert;
