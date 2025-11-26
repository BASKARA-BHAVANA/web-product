import { auth } from '@/lib/actions/auth';
import { cn } from '@/utils/misc';
import { ShieldUserIcon } from 'lucide-react';
import React, { ComponentProps } from 'react';

const AdminFab = async ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  const session = await auth(['ADMIN', 'SUPERADMIN'], { redirect: false });
  if (!session) return null;

  return (
    <div
      className={cn(
        'bg-foreground fixed right-0 bottom-6 z-10 flex max-w-xl flex-wrap items-center gap-3 rounded-l-lg py-2 ps-3 pe-6',
        className
      )}
      {...props}
    >
      <ShieldUserIcon className="text-primary" />
      {children}
    </div>
  );
};

export default AdminFab;
