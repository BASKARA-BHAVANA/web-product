import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/atoms/sidebar';
import { AdminSidebar } from './_components/sidebar';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !(session.user.role == 'ADMIN' || session.user.role == 'SUPERADMIN')
  )
    redirect('/auth/login');

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <SidebarTrigger className="absolute top-2 left-0" />
        <div className="bg-background flex flex-1 flex-col gap-4 p-4 pt-12">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
