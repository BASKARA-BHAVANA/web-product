'use server';

import { requireAuth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';

export async function getCabinets({
  search,
  page = 1,
  limit = 15,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const where = {
      ...(search && {
        OR: [{ name: { contains: search } }, { tagline: { contains: search } }],
      }),
    };

    return {
      data: await prisma.cabinet.findMany({
        where,
        select: {
          id: true,
          logo: true,
          name: true,
          isActive: true,
          _count: {
            select: {
              divisions: true,
              programs: true,
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      count: await prisma.cabinet.count({ where }),
    };
  } catch (error) {
    return { error };
  }
}

export type CreateUpdateCabinet = Partial<{
  name: string;
  tagline: string;
  logo: File;
  periode: string;
  primaryColor?: string;
  onPrimaryColor?: string;
  primaryImage: File;
  secondaryImage: File;
  description: string;
  vision: string;
  mission: string;
  isActive: boolean;
  contacts: {
    name?: string;
    key: string;
    value: string;
  }[];
}>;
