'use server';

import { buildActionFailed } from '@/lib/actions/action-failed-builder';
import { requireAuth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';
import { ActionSuccess } from '@/lib/actions/action-result';
import { deleteFile, deleteFiles, uploadFile } from '@/lib/actions/file';
import { CreateUpdateWorkProgram } from './model';
import { toSlug } from '@/utils/string';
import moment from 'moment';

export interface getWorkProgramsProps {
  search?: string;
  cabinetIds?: string[];
  divisionIds?: string[];
  isPinned?: boolean;
  page?: number;
  limit?: number;
}

export async function getWorkPrograms({
  search,
  cabinetIds,
  divisionIds,
  isPinned,
  page = 1,
  limit = 15,
}: getWorkProgramsProps) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const where = {
      ...(cabinetIds?.length && {
        cabinetId: {
          in: cabinetIds,
        },
      }),
      ...(divisionIds?.length && {
        divisionId: {
          in: divisionIds,
        },
      }),
      ...(!!isPinned && {
        isPinned: isPinned,
      }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    return new ActionSuccess('Berhasil', {
      items: await prisma.workProgram.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          isPinned: true,
          division: {
            select: {
              id: true,
              logo: true,
              name: true,
            },
          },
          cabinet: {
            select: {
              id: true,
              logo: true,
              name: true,
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      count: await prisma.workProgram.count({ where }),
    }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function deleteWorkProgram(id: string) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const data = await prisma.workProgram.delete({
      where: { id },
    });

    if (data.picture) await deleteFile(data.picture);

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

export async function getDivisions({ cabinetId }: { cabinetId: string }) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const data = await prisma.division.findMany({
      where: { cabinetId },
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

export async function createWorkProgram(payload: CreateUpdateWorkProgram) {
  const uploaded: string[] = [];

  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const { picture, startDate, endDate, ...rest } = payload;

    const slug = toSlug(rest.title);

    const upPicture = picture
      ? await uploadFile(picture, {
          access: 'public',
          baseFolder: 'workprogram-pictures',
        })
      : null;
    if (upPicture?.path) uploaded.push(upPicture.path);

    await prisma.workProgram.create({
      data: {
        ...rest,
        slug,
        picture: upPicture?.path ?? '',
        startDate: startDate ? moment(startDate).toDate() : undefined,
        endDate: endDate ? moment(endDate).toDate() : undefined,
      },
    });

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    await deleteFiles(uploaded);
    return buildActionFailed(error).toPlain();
  }
}

export async function updateWorkProgram(
  id: string,
  payload: Partial<CreateUpdateWorkProgram>
) {
  const uploaded: string[] = [];

  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const { picture, startDate, endDate, ...rest } = payload;
    const old = await prisma.workProgram.findUniqueOrThrow({ where: { id } });

    const newSlug = rest.title ? toSlug(rest.title) : undefined;

    const upPicture = picture
      ? await uploadFile(picture, {
          access: 'public',
          baseFolder: 'workprogram-pictures',
        })
      : null;
    if (upPicture?.path) uploaded.push(upPicture.path);

    await prisma.workProgram.update({
      where: { id },
      data: {
        ...rest,
        slug: newSlug,
        ...(upPicture && { picture: upPicture.path }),
        startDate: startDate ? moment(startDate).toDate() : undefined,
        endDate: endDate ? moment(endDate).toDate() : undefined,
      },
    });

    await Promise.allSettled([
      picture && old.picture ? deleteFile(old.picture) : null,
    ]);

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    await deleteFiles(uploaded);
    return buildActionFailed(error).toPlain();
  }
}

export async function getWorkProgram(id: string) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);
    const data = await prisma.workProgram.findUniqueOrThrow({
      where: { id },
    });
    return new ActionSuccess('Berhasil', data);
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}
