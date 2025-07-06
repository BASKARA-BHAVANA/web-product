'use client';

import {
  ActionFailed,
  ActionResponse,
  ActionSuccess,
} from '@/lib/actions/action-response';
import { toast } from 'sonner';

interface Props {
  res: unknown;
}

const actionResponseToast = ({ res }: Props) => {
  if (!(res instanceof ActionResponse)) return null;

  if (res instanceof ActionSuccess) toast.success(res.message);
  else if (res instanceof ActionFailed) toast.error(res.message);
};

export default actionResponseToast;
