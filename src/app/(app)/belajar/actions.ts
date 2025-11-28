'use server';

import { ActionResult } from '@/@types/global';
import { CreateUpdateCourse } from './schema';
import { Course } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';
import { flashSet } from '@/lib/actions/flash';
import { redirect, RedirectType } from 'next/navigation';

export async function createCourse({
  data,
}: {
  data: CreateUpdateCourse;
}): Promise<ActionResult<Course>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const course = await prisma.course.create({
      data,
    });

    return {
      success: true,
      message: 'Berhasil',
      data: course,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi masalah',
    };
  }
}

export async function updateCourse({
  id,
  data,
}: {
  id: string;
  data: CreateUpdateCourse;
}): Promise<ActionResult<Course>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const course = await prisma.course.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: 'Berhasil',
      data: course,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi masalah',
    };
  }
}

export async function deleteCourse(
  id: string,
  redirectTo: string = '/belajar/cari'
) {
  try {
    const course = await prisma.course.delete({ where: { id } });
    await flashSet({
      success: true,
      message: 'Berhasil hapus materi ' + course.title,
    } as ActionResult);
  } catch (err: any) {
    await flashSet({ success: false, message: err.message } as ActionResult);
  }
  redirect(redirectTo, RedirectType.replace);
}
