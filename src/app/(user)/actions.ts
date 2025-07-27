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
        ...(cabinetSlug ? { slug: cabinetSlug } : { isActive: true }),
      },
      include: {
        divisions: {
          include: {
            cabinet: {
              select: { slug: true },
            },
            _count: {
              select: { members: true, programs: true },
            },
          },
        },
        contacts: true,
        programs: {
          where: { isPinned: true },
          select: {
            id: true,
            slug: true,
            title: true,
            isPinned: true,
            picture: true,
            division: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            cabinet: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    const cabinets = await prisma.cabinet.findMany({
      select: {
        name: true,
        logo: true,
        slug: true,
      },
    });

    return new ActionSuccess('Berhasil', { cabinet, cabinets }).toPlain();
  } catch (err) {
    return buildActionFailed(err).toPlain();
  }
}

export interface getDivisionPageProps {
  cabinetSlug: string;
  divisionSlug: string;
}

export async function getDivisionPageData({
  cabinetSlug,
  divisionSlug,
}: getDivisionPageProps) {
  try {
    const { programs, members, ...division } =
      await prisma.division.findFirstOrThrow({
        where: {
          slug: divisionSlug,
          cabinet: { slug: cabinetSlug },
        },
        include: {
          cabinet: {
            select: { id: true, slug: true, name: true },
          },
          members: true,
          programs: {
            select: {
              id: true,
              slug: true,
              title: true,
              startDate: true,
              endDate: true,
              picture: true,
              description: true,
            },
          },
        },
      });

    return new ActionSuccess('Berhasil', {
      division,
      programs,
      members,
    }).toPlain();
  } catch (err) {
    return buildActionFailed(err).toPlain();
  }
}
