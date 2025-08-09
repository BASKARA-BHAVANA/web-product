'use server';

import { Course } from '@/generated/prisma';
import { buildActionFailed } from '@/lib/actions/action-failed-builder';
import { ActionSuccess } from '@/lib/actions/action-result';
import { prisma } from '@/lib/prisma';

export interface searchCoursesProps {
  search?: string;
  page: number;
  limit: number;
}

export async function searchCourses({
  search,
  page,
  limit,
}: searchCoursesProps) {
  try {
    const where = {
      ...(search && {
        OR: [{ title: { contains: search } }, { tags: { contains: search } }],
      }),
    };

    const items = await prisma.course.findMany({
      where,
      omit: {
        file: true,
        content: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const count = await prisma.course.count({ where });

    return new ActionSuccess('Success', {
      items,
      count,
      search,
      page,
      limit,
    }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export interface exploreCoursesProps {
  parentSlug?: string;
  limit: number;
}

export async function exploreCourses({
  parentSlug,
  limit,
}: exploreCoursesProps) {
  try {
    const where = {
      ...(parentSlug
        ? {
            parent: { slug: parentSlug },
          }
        : { parentId: null }),
    };

    const items = await prisma.course.findMany({
      where,
      omit: {
        file: true,
        content: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const count = await prisma.course.count({ where });

    return new ActionSuccess('Success', {
      items,
      count,
      limit,
    }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export async function detailCourse(slug: string) {
  try {
    const item = await prisma.course.findUniqueOrThrow({
      where: { slug },
      include: {
        parent: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    return new ActionSuccess('success', { item }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}

export interface getCourseParentsProps {
  slug: string;
}

export async function getCourseParents({ slug }: getCourseParentsProps) {
  try {
    const items: Pick<Course, 'id' | 'title' | 'slug'>[] = [];

    let parentSlug: string | undefined = slug;
    do {
      // @ts-ignore
      const data = await prisma.course.findUniqueOrThrow({
        where: { slug: parentSlug },
        select: {
          id: true,
          title: true,
          slug: true,
          parent: {
            select: { slug: true },
          },
        },
      });
      items.unshift(data);
      parentSlug = data.parent?.slug;
    } while (parentSlug);

    return new ActionSuccess('Succes', { items }).toPlain();
  } catch (error) {
    return buildActionFailed(error).toPlain();
  }
}
