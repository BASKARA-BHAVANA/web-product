'use server';

import { ActionResult } from '@/@types/global';
import { Article } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';
import { CreateUpdateArticle } from './schema';
import { flashSet } from '@/lib/actions/flash';
import { redirect, RedirectType } from 'next/navigation';

export async function createArticle({
  data,
}: {
  data: CreateUpdateArticle;
}): Promise<ActionResult<Article>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const article = await prisma.article.create({
      data,
    });

    return {
      success: true,
      message: 'Berhasil',
      data: article,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi masalah',
    };
  }
}

export async function updateArticle({
  id,
  data,
}: {
  id: string;
  data: CreateUpdateArticle;
}): Promise<ActionResult<Article>> {
  await auth(['ADMIN', 'SUPERADMIN']);

  try {
    const article = await prisma.article.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: 'Berhasil',
      data: article,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi masalah',
    };
  }
}

export async function deleteArticle(
  id: string,
  redirectTo: string = '/artikel'
) {
  try {
    const article = await prisma.article.delete({ where: { id } });
    await flashSet({
      success: true,
      message: 'Berhasil hapus artikel ' + article.title,
    } as ActionResult);
  } catch (err: any) {
    await flashSet({ success: false, message: err.message } as ActionResult);
  }
  redirect(redirectTo, RedirectType.replace);
}
