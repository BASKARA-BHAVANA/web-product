'use server';

import { Role, User } from '@/generated/prisma';
import { requireAuth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';

export async function getUsers({
  search,
  role,
  page = 1,
  limit = 15,
}: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<{ data?: User[]; count?: number; error?: unknown }> {
  try {
    await requireAuth(['SUPERADMIN']);

    const where = {
      ...(search && {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
      }),
      ...(role && {
        role: role as Role,
      }),
    };

    return {
      data: await prisma.user.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      count: await prisma.user.count({ where }),
    };
  } catch (error) {
    return { error };
  }
}
