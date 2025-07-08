'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { ActionFailed } from './action-result';

export async function requireAuth(roles?: string[]) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new ActionFailed('Harap login terlebih dahulu');
  }

  if (roles) {
    const userRole = session.user.role ?? '';
    if (!roles.includes(userRole)) {
      throw new ActionFailed('Kamu tidak memiliki Akses');
    }
  }

  return session;
}
