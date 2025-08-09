import React, { Fragment } from 'react';
import { exploreCourses, getCourseParents } from '../../actions';
import Container from '@/components/molecules/container';
import HeroTitle from '../../_components/hero-title';
import { CourseCardCompact } from '@/components/molecules/course-cards';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/atoms/breadcrumb';
import { HomeIcon } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import Link from 'next/link';

const View = ({
  slugs,
  data,
  parents,
}: {
  slugs: string[];
  data: NonNullable<Awaited<ReturnType<typeof exploreCourses>>['data']>;
  parents?: NonNullable<Awaited<ReturnType<typeof getCourseParents>>['data']>;
}) => {
  const { items, count, limit } = data;
  return (
    <>
      <Container className="py-12">
        {parents?.items.length ? (
          <>
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/materi-belajar/struktur/0/`}>
                    <HomeIcon size={18} />
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {parents.items.map((item, i, arr) => (
                  <Fragment key={i}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/materi-belajar/struktur/0/${arr
                          .slice(0, i + 1)
                          .map((ar) => ar.slug)
                          .join('/')}`}
                      >
                        {item.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="typo-h1">{parents.items.at(-1)?.title}</h1>
            <p className="typo-p text-muted-foreground mt-3">{count} materi</p>
          </>
        ) : (
          <HeroTitle />
        )}
      </Container>

      <Container className="flex flex-col gap-3">
        {items.map((item, i) => (
          <CourseCardCompact key={i} course={item} prevSlugs={slugs} />
        ))}
        <div className="flex justify-center">
          {limit < count && (
            <Button variant={'secondary'} asChild>
              <Link href={`?limit=${limit + 20}`} replace>
                Muat lebih banyak
              </Link>
            </Button>
          )}
        </div>
      </Container>
    </>
  );
};

export default View;
