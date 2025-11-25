'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function auth(roles?: string[]) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect('/auth/login');
  }

  if (roles) {
    const userRole = session.user.role ?? '';
    if (!roles.includes(userRole)) {
      redirect('/auth/forbidden');
    }
  }

  return session;
}
