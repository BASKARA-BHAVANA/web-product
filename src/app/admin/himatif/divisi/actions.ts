'use server';

import { buildActionFailed } from '@/lib/actions/action-failed-builder';
import { requireAuth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';
import { ActionSuccess } from '@/lib/actions/action-result';
import { deleteFile, deleteFiles, uploadFile } from '@/lib/actions/file';
import { CreateUpdateDivision } from './model';
import { toSlug } from '@/utils/string';

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
      ...(cabinetIds?.length && {
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

export async function createDivision(payload: CreateUpdateDivision) {
  const uploaded: string[] = [];

  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const { logo, ...rest } = payload;

    const slug = toSlug(rest.name);

    const upLogo = logo
      ? await uploadFile(logo, {
          access: 'public',
          baseFolder: 'division-logos',
        })
      : null;
    if (upLogo?.path) uploaded.push(upLogo.path);

    await prisma.division.create({
      data: {
        ...rest,
        slug,
        logo: upLogo?.path ?? '',
      },
    });

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    await deleteFiles(uploaded);
    return buildActionFailed(error).toPlain();
  }
}

export async function updateDivision(
  id: string,
  payload: Partial<CreateUpdateDivision>
) {
  const uploaded: string[] = [];

  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const { logo, ...rest } = payload;
    const old = await prisma.division.findUniqueOrThrow({ where: { id } });

    const newSlug = rest.name ? toSlug(rest.name) : undefined;

    const upLogo = logo
      ? await uploadFile(logo, {
          access: 'public',
          baseFolder: 'division-logos',
        })
      : null;
    if (upLogo?.path) uploaded.push(upLogo.path);

    await prisma.division.update({
      where: { id },
      data: {
        ...rest,
        slug: newSlug,
        ...(upLogo && { logo: upLogo.path }),
      },
    });

    await Promise.allSettled([logo && old.logo ? deleteFile(old.logo) : null]);

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    await deleteFiles(uploaded);
    return buildActionFailed(error).toPlain();
  }
}

export async function getDivision(id: string) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);
    const data = await prisma.division.findUniqueOrThrow({
      where: { id },
    });
    return new ActionSuccess('Berhasil', data);
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}
