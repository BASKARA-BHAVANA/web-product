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
        'bg-background border-foreground shadow-primary fixed right-6 bottom-6 z-10 flex max-w-xl flex-wrap items-center gap-3 rounded-lg border p-3 shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
      <div className="bg-primary border-primary-foreground text-primary-foreground absolute right-3 bottom-full flex items-center gap-1 rounded-t-lg border px-2 py-1">
        <ShieldUserIcon size={16} />
        <small className="typo-small">Admin</small>
      </div>
    </div>
  );
};

export default AdminFab;
