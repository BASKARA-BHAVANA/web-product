'use server';

import { ActionResult } from '@/@types/global';
import { Cabinet } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';
import { CreateUpdateCabinet } from './schema';
import { flashSet } from '@/lib/actions/flash';
import { redirect, RedirectType } from 'next/navigation';
import { buildError } from '@/lib/actions/error';

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
          createMany: {
            data:
              data.contacts?.map(({ key, label, value }) => ({
                key,
                value,
                label: label ?? '',
              })) ?? [],
          },
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
    return buildError(err);
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
                label: label ?? '',
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
    return buildError(err);
  }
}

export async function deleteCabinet(id: string, redirectTo: string = '/') {
  try {
    const cabinet = await prisma.cabinet.delete({ where: { id } });
    await flashSet({
      success: true,
      message: 'Berhasil hapus kabinet ' + cabinet.name,
    } as ActionResult);
  } catch (err: any) {
    await flashSet({ success: false, message: err.message } as ActionResult);
  }
  redirect(redirectTo, RedirectType.replace);
}
