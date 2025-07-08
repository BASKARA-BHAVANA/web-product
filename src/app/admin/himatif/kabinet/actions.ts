'use server';

import { buildActionFailed } from '@/lib/actions/action-failed-builder';
import { requireAuth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';
import { CreateUpdateCabinet } from './model';
import { deleteFile, uploadFile } from '@/lib/actions/file';
import { ActionSuccess } from '@/lib/actions/action-result';

export interface getCabinetsProps {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getCabinets({
  search,
  page = 1,
  limit = 15,
}: getCabinetsProps) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const where = {
      ...(search && {
        OR: [{ name: { contains: search } }, { tagline: { contains: search } }],
      }),
    };

    return new ActionSuccess('Berhasil', {
      items: await prisma.cabinet.findMany({
        where,
        select: {
          id: true,
          logo: true,
          name: true,
          isActive: true,
          periode: true,
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
    }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function createCabinet(payload: CreateUpdateCabinet) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const { logo, primaryImage, secondaryImage, contacts, ...rest } = payload;

    const upLogo = logo
      ? await uploadFile(logo, {
          access: 'public',
          baseFolder: 'himatif-logos',
        })
      : null;
    const upPrimaryImage = primaryImage
      ? await uploadFile(primaryImage, {
          access: 'public',
          baseFolder: 'himatif-images',
        })
      : null;
    const upSecondaryImage = secondaryImage
      ? await uploadFile(secondaryImage, {
          access: 'public',
          baseFolder: 'himatif-images',
        })
      : null;

    if (rest.isActive) {
      await prisma.cabinet.updateMany({ data: { isActive: false } });
    }

    await prisma.cabinet.create({
      data: {
        ...rest,
        logo: upLogo?.path ?? '',
        primaryImage: upPrimaryImage?.path ?? '',
        secondaryImage: upSecondaryImage?.path ?? '',
        contacts: {
          createMany: {
            data: contacts?.map((c) => ({ ...c, name: c.name ?? '' })) ?? [],
          },
        },
      },
    });

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function deleteCabinet(id: string) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const data = await prisma.cabinet.delete({
      where: { id },
    });

    if (data.logo) await deleteFile(data.logo, 'public');
    if (data.primaryImage) await deleteFile(data.primaryImage, 'public');
    if (data.secondaryImage) await deleteFile(data.secondaryImage, 'public');

    return new ActionSuccess('Berhasil').toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}
