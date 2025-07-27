'use server';

import { buildActionFailed } from '@/lib/actions/action-failed-builder';
import { requireAuth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';
import { ActionSuccess } from '@/lib/actions/action-result';
import { deleteFile, deleteFiles, uploadFile } from '@/lib/actions/file';
import { toSlug } from '@/utils/string';
import { CreateEvent, UpdateEvent } from './model';

export interface getEventsProps {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getEvents({
  search,
  page = 1,
  limit = 15,
}: getEventsProps) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search } },
          { location: { contains: search } },
        ],
      }),
    };

    const items = await prisma.event.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        location: true,
        startDate: true,
        endDate: true,
        isActive: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    const count = await prisma.event.count({ where });

    return new ActionSuccess('Berhasil', {
      items,
      count,
    }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function deleteEvent(id: string) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const data = await prisma.event.delete({
      where: { id },
    });

    if (data.image) await deleteFile(data.image);

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function createEvent(payload: CreateEvent) {
  const uploaded: string[] = [];

  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const { image, startDate, endDate, ...rest } = payload;

    const slug = toSlug(rest.title);

    const upImage = image
      ? await uploadFile(image, {
          access: 'public',
          baseFolder: 'event-images',
        })
      : null;
    if (upImage?.path) uploaded.push(upImage.path);

    await prisma.event.create({
      data: {
        ...rest,
        slug,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        image: upImage?.path ?? '',
      },
    });

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    await deleteFiles(uploaded);
    return buildActionFailed(error).toPlain();
  }
}

export async function updateEvent(id: string, payload: UpdateEvent) {
  const uploaded: string[] = [];

  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const { image, startDate, endDate, ...rest } = payload;
    const old = await prisma.event.findUniqueOrThrow({ where: { id } });

    const newSlug = rest.title ? toSlug(rest.title) : undefined;

    const upImage = image
      ? await uploadFile(image, {
          access: 'public',
          baseFolder: 'event-images',
        })
      : null;
    if (upImage?.path) uploaded.push(upImage.path);

    await prisma.event.update({
      where: { id },
      data: {
        ...rest,
        slug: newSlug,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        ...(upImage && { image: upImage.path }),
      },
    });

    await Promise.allSettled([
      image && old.image ? deleteFile(old.image) : null,
    ]);

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    await deleteFiles(uploaded);
    return buildActionFailed(error).toPlain();
  }
}

export async function getEvent(id: string) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);
    const data = await prisma.event.findUniqueOrThrow({
      where: { id },
    });
    return new ActionSuccess('Berhasil', data);
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}
