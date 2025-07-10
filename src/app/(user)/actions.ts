'use server';

import { buildActionFailed } from '@/lib/actions/action-failed-builder';
import { ActionSuccess } from '@/lib/actions/action-result';
import { prisma } from '@/lib/prisma';

export interface getHomePageDataProps {
  cabinetSlug?: string;
}

export async function getHomePageData({ cabinetSlug }: getHomePageDataProps) {
  try {
    const cabinet = await prisma.cabinet.findFirstOrThrow({
      where: {
        ...(cabinetSlug ? { id: cabinetSlug } : { isActive: true }),
      },
      include: {
        divisions: true,
        contacts: true,
      },
    });

    const cabinets = await prisma.cabinet.findMany({
      where: {
        id: { notIn: [cabinet.id] },
      },
      select: {
        name: true,
        logo: true,
        id: true,
      },
    });

    return new ActionSuccess('Berhasil', { cabinet, cabinets }).toPlain();
  } catch (err) {
    return buildActionFailed(err).toPlain();
  }
}
