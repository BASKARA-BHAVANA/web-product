import React from 'react';
import { searchCourses } from '../actions';
import Container from '@/components/molecules/container';
import HeroTitle from '../_components/hero-title';
import { Input } from '@/components/atoms/input';
import { EllipsisPagination } from '@/components/molecules/pagination-server';
import { CourseCardDefault } from '@/components/molecules/course-cards';

const View = ({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof searchCourses>>['data']>;
}) => {
  const { search, limit, page, count, items } = data;
  return (
    <>
      <Container className="max-w-3xl py-12">
        <HeroTitle />
        <form method="get">
          <Input
            autoFocus
            name="search"
            defaultValue={search}
            placeholder="Cari..."
          />
        </form>
      </Container>

      <Container className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <CourseCardDefault key={i} course={item} />
        ))}
      </Container>

      <Container className="max-w-fit">
        <EllipsisPagination limit={limit} page={page} totalItems={count} />
      </Container>
    </>
  );
};

export default View;
