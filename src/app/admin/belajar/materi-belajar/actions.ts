'use server';

import { buildActionFailed } from '@/lib/actions/action-failed-builder';
import { ActionSuccess } from '@/lib/actions/action-result';
import { requireAuth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';
import { CreateCourse, UpdateCourse } from './model';
import { toSlug } from '@/utils/string';
import { Course } from '@/generated/prisma';

export interface getCoursesProps {
  parentSlug?: string;
  page?: number;
  limit?: number;
}

export async function getCourses({
  parentSlug,
  page = 1,
  limit = 15,
}: getCoursesProps) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const where = {
      ...(parentSlug
        ? {
            parent: {
              slug: parentSlug,
            },
          }
        : {
            parentId: null,
          }),
    };

    const items = await prisma.course.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        tags: true,
        _count: {
          select: { children: true },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    const count = await prisma.course.count({ where });

    return new ActionSuccess('Berhasil', { items, count }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export interface getCoursesTitleProps {
  slugs: string[];
}

export async function getCoursesTitle({ slugs }: getCoursesTitleProps) {
  try {
    const items = await prisma.course.findMany({
      where: { slug: { in: slugs } },
      select: { title: true, slug: true, id: true },
    });

    return new ActionSuccess('Success', { items }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export interface getCourseParentsProps {
  id: string;
}

export async function getCourseParents({ id }: getCourseParentsProps) {
  try {
    const items: Pick<Course, 'id' | 'title' | 'slug'>[] = [];

    let parentId: string | null = id;
    do {
      // @ts-ignore
      const data = await prisma.course.findUniqueOrThrow({
        where: { id: parentId },
        select: { id: true, title: true, slug: true, parentId: true },
      });
      items.unshift(data);
      parentId = data.parentId;
    } while (parentId);

    return new ActionSuccess('Succes', { items }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function deleteCourse(id: string) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    await prisma.course.delete({
      where: { id },
    });

    return new ActionSuccess('Success').toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function createCourse(payload: CreateCourse) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const { tags, ...rest } = payload;
    const slug = toSlug(rest.title);

    await prisma.course.create({
      data: {
        ...rest,
        tags: tags?.join(';'),
        slug: slug,
      },
    });

    return new ActionSuccess('Success').toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function updateCourse(id: string, payload: UpdateCourse) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);

    const { tags, ...rest } = payload;
    const slug = rest.title ? toSlug(rest.title) : undefined;

    await prisma.course.update({
      where: { id },
      data: {
        ...rest,
        tags: tags?.join(';'),
        slug: slug,
      },
    });

    return new ActionSuccess('Success').toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function getCourse(id: string) {
  try {
    await requireAuth(['ADMIN', 'SUPERADMIN']);
    const data = await prisma.course.findUniqueOrThrow({
      where: { id },
      include: {
        parent: {
          select: {
            title: true,
            slug: true,
            id: true,
          },
        },
      },
    });
    return new ActionSuccess('Success', data);
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}
