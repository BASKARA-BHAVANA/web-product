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

export interface getWorkProgramsPageProps {
  cabinetSlug: string;
  page: number;
  limit: number;
  search?: string;
}

export async function getWorkProgramsPageData({
  cabinetSlug,
  page,
  limit,
  search,
}: getWorkProgramsPageProps) {
  try {
    const cabinet = await prisma.cabinet.findUniqueOrThrow({
      where: { slug: cabinetSlug },
      select: {
        name: true,
      },
    });

    const where = {
      cabinet: {
        slug: cabinetSlug,
      },
      ...(search && {
        OR: [
          { title: { contains: search } },
          { division: { name: { contains: search } } },
        ],
      }),
    };
    const programs = await prisma.workProgram.findMany({
      where,
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
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await prisma.workProgram.count({ where });

    return new ActionSuccess('Berhasil', {
      cabinet,
      programs,
      count,
      page,
      limit,
      search,
    }).toPlain();
  } catch (err) {
    return buildActionFailed(err).toPlain();
  }
}

export interface getWorkProgramPageProps {
  workProgramSlug: string;
}

export async function getWorkProgramPageData({
  workProgramSlug,
}: getWorkProgramPageProps) {
  try {
    const { division, cabinet, ...workProgram } =
      await prisma.workProgram.findFirstOrThrow({
        where: {
          slug: workProgramSlug,
        },
        include: {
          cabinet: {
            select: { id: true, name: true, logo: true },
          },
          division: {
            select: { id: true, name: true, logo: true },
          },
        },
      });

    return new ActionSuccess('Berhasil', {
      division,
      cabinet,
      workProgram,
    }).toPlain();
  } catch (err) {
    return buildActionFailed(err).toPlain();
  }
}
