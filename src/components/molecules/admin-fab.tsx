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
        'bg-background border-foreground fixed right-6 bottom-6 z-10 flex w-full max-w-xl flex-wrap items-center gap-3 rounded-lg border p-3',
        className
      )}
      {...props}
    >
      <ShieldUserIcon size={28} className="text-foreground" />
      {children}
    </div>
  );
};

export default AdminFab;
