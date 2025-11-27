'use server';

import { ActionResult } from '@/@types/global';
import { Cabinet } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';
import { CreateUpdateCabinet } from './schema';

export async function createCabinet({
  data,
}: {
  data: CreateUpdateCabinet;
}): Promise<ActionResult<Cabinet>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const cabinet = await prisma.cabinet.create({
      data: {
        ...data,
        contacts: {
          createMany: { data: data.contacts ?? [] },
        },
      },
    });

    if (cabinet.isActive) {
      await prisma.cabinet.updateMany({
        where: { id: { not: cabinet.id } },
        data: { isActive: false },
      });
    }

    return {
      success: true,
      message: 'Berhasil',
      data: cabinet,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi masalah',
    };
  }
}

export async function updateCabinet({
  id,
  data,
}: {
  id: string;
  data: CreateUpdateCabinet;
}): Promise<ActionResult<Cabinet>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const { contacts, ...rData } = data;
    const cabinet = await prisma.cabinet.update({
      where: { id },
      data: {
        ...rData,
        ...(!!contacts && {
          contacts: {
            deleteMany: {},
            createMany: {
              data: contacts.map(({ key, label, value }) => ({
                key,
                value,
                label,
              })),
            },
          },
        }),
      },
    });

    if (rData.isActive) {
      await prisma.cabinet.updateMany({
        where: { id: { not: id } },
        data: { isActive: false },
      });
    }

    return {
      success: true,
      message: 'Berhasil',
      data: cabinet,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi masalah',
    };
  }
}
