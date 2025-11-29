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
        'bg-background border-primary-foreground shadow-primary fixed right-6 bottom-6 z-10 flex max-w-xl flex-wrap items-center gap-3 rounded-xl border p-2 ps-3 shadow-xl',
        className
      )}
      {...props}
    >
      <ShieldUserIcon />
      {children}
    </div>
  );
};

export default AdminFab;
