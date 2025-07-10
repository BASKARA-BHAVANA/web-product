'use server';

import { buildActionFailed } from '@/lib/actions/action-failed-builder';
import { requireAuth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';
import { ActionSuccess } from '@/lib/actions/action-result';
import { deleteFile } from '@/lib/actions/file';

export interface getDivisionsProps {
  search?: string;
  cabinetIds?: string[];
  page?: number;
  limit?: number;
}

export async function getDivisions({
  search,
  cabinetIds,
  page = 1,
  limit = 15,
}: getDivisionsProps) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const where = {
      ...(cabinetIds && {
        cabinetId: {
          in: cabinetIds,
        },
      }),
      ...(search && {
        OR: [{ name: { contains: search } }, { tagline: { contains: search } }],
      }),
    };

    return new ActionSuccess('Berhasil', {
      items: await prisma.division.findMany({
        where,
        select: {
          id: true,
          logo: true,
          name: true,
          _count: {
            select: {
              members: true,
              programs: true,
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      count: await prisma.division.count({ where }),
    }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function deleteDivision(id: string) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const data = await prisma.division.delete({
      where: { id },
    });

    if (data.logo) await deleteFile(data.logo);

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function getCabinets() {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const data = await prisma.cabinet.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return new ActionSuccess('Berhasil', data).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}
