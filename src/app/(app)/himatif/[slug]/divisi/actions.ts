'use server';

import { ActionResult } from '@/@types/global';
import { Division } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';
import { CreateUpdateDivision } from './schema';

export async function createDivision({
  data,
}: {
  data: CreateUpdateDivision;
}): Promise<ActionResult<Division>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const division = await prisma.division.create({
      data: {
        ...data,
        members: {
          createMany: { data: data.members ?? [] },
        },
      },
    });

    return {
      success: true,
      message: 'Berhasil',
      data: division,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi masalah',
    };
  }
}

export async function updateDivision({
  id,
  data,
}: {
  id: string;
  data: CreateUpdateDivision;
}): Promise<ActionResult<Division>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const { members, ...rData } = data;
    const division = await prisma.division.update({
      where: { id },
      data: {
        ...rData,
        ...(!!members && {
          members: {
            deleteMany: {},
            createMany: {
              data: members.map(({ name, position, picturePath }) => ({
                name,
                position,
                picturePath,
              })),
            },
          },
        }),
      },
    });

    return {
      success: true,
      message: 'Berhasil',
      data: division,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi masalah',
    };
  }
}
