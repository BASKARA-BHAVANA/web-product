import Container from '@/components/molecules/container';
import { CourseCard } from '@/components/organisms/course-widgets';
import { Input } from '@/components/atoms/input';
import { prisma } from '@/lib/prisma';
import { EllipsisPagination } from '@/components/molecules/pagination';
import Headline from '@/components/molecules/headline';
import { ExceptionOverlay } from '@/components/molecules/exception';

const Page = async (props: {
  searchParams: Promise<{ search?: string; page?: number; limit?: number }>;
}) => {
  const { search = '', limit = 10, page = 1 } = await props.searchParams;
  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { tags: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.count({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { tags: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
    }),
  ]);

  return (
    <>
      <Container className="max-w-3xl py-12">
        <Headline
          className="mb-12 items-center"
          largeTexts={['Bridging Informatics']}
          headText="Eksplorasi Dunia Informatika"
        />

        <form method="get">
          <Input
            autoFocus
            name="search"
            defaultValue={search}
            placeholder="Cari..."
          />
        </form>
      </Container>

      <Container>
        {courses.length ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {courses?.map((dat, i) => <CourseCard key={i} data={dat} />)}
          </div>
        ) : (
          <ExceptionOverlay
            title="Materi tidak ditemukan"
            subtitle={`Pencarian "${search}" tidak cocok dengan materi apa pun`}
          />
        )}
      </Container>

      <Container className="max-w-fit">
        <EllipsisPagination limit={limit} page={page} totalItems={total ?? 0} />
      </Container>
    </>
  );
};

export default Page;
