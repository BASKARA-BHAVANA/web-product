import Container from '@/components/molecules/container';
import { CourseCard } from '@/components/organisms/course-widgets';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/atoms/breadcrumb';
import { Button } from '@/components/atoms/button';
import { ArrowUpRightIcon, HomeIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react/jsx-runtime';
import { prisma } from '@/lib/prisma';
import Headline from '@/components/molecules/headline';
import { ExceptionOverlay } from '@/components/molecules/exception';
import AdminView from '@/components/molecules/admin-view';

const Page = async (props: { params: Promise<{ slugs: string[] }> }) => {
  const { slugs } = await props.params;

  const fixSlugs = slugs.slice(1);
  const headSlug = fixSlugs.at(-1);

  const courses = await prisma.course.findMany({
      where: headSlug
        ? {
            course: { slug: headSlug },
            courseId: { not: null },
          }
        : {
            courseId: { equals: null },
          },
      select: {
        id: true,
        title: true,
        slug: true,
        tags: true,
        _count: { select: { courses: true } },
      },
    }),
    parentCourses = headSlug
      ? await prisma.course.findMany({
          where: { slug: { in: fixSlugs } },
          select: { id: true, title: true, slug: true, tags: true },
        })
      : undefined;

  const fixParentCourses = fixSlugs
    .map((s) => parentCourses?.find((item) => item.slug === s))
    .filter(Boolean);

  return (
    <>
      <Container>
        <Headline
          className="mb-12 items-center"
          largeTexts={['Bridging Informatics']}
          headText="Eksplorasi Dunia Informatika"
        />

        <AdminView className="mb-6">
          <Button variant={'outline'} size={'sm'} asChild>
            <Link href={`/belajar/${headSlug ?? '0'}/tambah`}>
              <PlusIcon />
              Materi baru disini
            </Link>
          </Button>
        </AdminView>

        {fixParentCourses.length > 0 && (
          <>
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/belajar/struktur/0">
                    <HomeIcon size={16} />
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {fixParentCourses.map((dat, i) => (
                  <Fragment key={i}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">{dat?.title}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-6 flex items-center gap-3">
              <h4 className="typo-h4">{fixParentCourses.at(-1)?.title}</h4>
              <Button asChild>
                <Link href={`/belajar/${fixParentCourses.at(-1)?.slug}`}>
                  Buka <ArrowUpRightIcon />
                </Link>
              </Button>
            </div>
          </>
        )}

        {courses.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {courses.map((dat, i) => (
              <CourseCard
                key={i}
                data={dat}
                href={
                  dat._count.courses > 0
                    ? `/belajar/struktur/0/${fixSlugs.join('/')}/${dat.slug}`
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <ExceptionOverlay
            title="Masih Kosong"
            subtitle={`Belum ada materi belajar ${fixParentCourses.at(-1) ? `"${fixParentCourses.at(-1)?.title}"` : 'disini'}`}
          />
        )}
      </Container>
    </>
  );
};

export default Page;
