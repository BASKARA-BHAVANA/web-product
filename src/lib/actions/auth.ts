'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Role } from '@/generated/prisma';
import { getServerSession, Session } from 'next-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function auth(
  roles?: Role[],
  options?: { redirect?: true }
): Promise<Session>;

export async function auth(
  roles?: Role[],
  options?: { redirect?: false }
): Promise<Session | null>;

export async function auth(
  roles?: Role[],
  options: { redirect?: boolean } = { redirect: true }
) {
  const session = await getServerSession(authOptions);

  const h = await headers(),
    url = h.get('x-pathname') || '/';

  if (!session || !session.user?.email) {
    if (options.redirect) redirect('/auth/login?callback=' + url);
    return null;
  }

  if (roles) {
    const userRole = session.user.role;
    if ((userRole && !roles.includes(userRole)) || !userRole) {
      if (options.redirect) redirect('/forbidden');
      return null;
    }
  }

  return session;
}
