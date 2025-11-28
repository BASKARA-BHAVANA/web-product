'use server';

import { ActionResult } from '@/@types/global';
import { WorkProgram } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';
import { CreateUpdateWorkProgram } from './schema';
import { buildError } from '@/lib/actions/error';
import { toDate } from '@/utils/date';

export async function createWorkProgram({
  data,
}: {
  data: CreateUpdateWorkProgram;
}): Promise<ActionResult<WorkProgram>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const workProgram = await prisma.workProgram.create({
      data: {
        ...data,
        startDate: data.startDate ? toDate(data.startDate) : undefined,
        endDate: data.endDate ? toDate(data.endDate) : undefined,
      },
    });

    return {
      success: true,
      message: 'Berhasil',
      data: workProgram,
    };
  } catch (err: any) {
    return buildError(err);
  }
}

export async function updateWorkProgram({
  id,
  data,
}: {
  id: string;
  data: CreateUpdateWorkProgram;
}): Promise<ActionResult<WorkProgram>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const workProgram = await prisma.workProgram.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate != undefined ? toDate(data.startDate) : null,
        endDate: data.endDate != undefined ? toDate(data.endDate) : null,
      },
    });

    return {
      success: true,
      message: 'Berhasil',
      data: workProgram,
    };
  } catch (err: any) {
    return buildError(err);
  }
}
