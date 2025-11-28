import { auth } from '@/lib/actions/auth';
import { cn } from '@/utils/misc';
import { ShieldUserIcon } from 'lucide-react';
import React, { ComponentProps } from 'react';

const AdminView = async ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  const session = await auth(['ADMIN', 'SUPERADMIN'], { redirect: false });
  if (!session) return null;

  return (
    <div
      className={cn(
        'bg-secondary flex max-w-fit flex-wrap items-center gap-1 rounded-md border p-1',
        className
      )}
      {...props}
    >
      <div className="bg-primary border-primary-foreground mx-1 rounded-full border p-1">
        <ShieldUserIcon size={20} />
      </div>
      {children}
    </div>
  );
};

export default AdminView;
