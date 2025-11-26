import Container from '@/components/molecules/container';
import { Input } from '@/components/atoms/input';
import { prisma } from '@/lib/prisma';
import { EllipsisPagination } from '@/components/molecules/pagination';
import Headline from '@/components/molecules/headline';
import { ExceptionOverlay } from '@/components/molecules/exception';
import { ArticleCard } from '@/components/organisms/article-widgets';
import { Prisma } from '@/generated/prisma';

const Page = async (props: {
  searchParams: Promise<{ search?: string; page?: number; limit?: number }>;
}) => {
  const { search = '', limit = 10, page = 1 } = await props.searchParams;
  const skip = (page - 1) * limit;

  const where: Prisma.ArticleWhereInput | undefined = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { tags: { contains: search, mode: 'insensitive' } },
        ],
      }
    : undefined;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        tags: true,
        picturePath: true,
      },
    }),
    prisma.article.count({
      where,
    }),
  ]);

  return (
    <>
      <Container className="max-w-3xl py-12">
        <Headline
          className="mb-12 items-center"
          largeTexts={['Artikel']}
          headText="Himatif: Apa yang Baru?"
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
        {articles.length ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {articles?.map((dat, i) => <ArticleCard key={i} data={dat} />)}
          </div>
        ) : (
          <ExceptionOverlay
            title="Artikel tidak ditemukan"
            subtitle={`Pencarian "${search}" tidak cocok dengan artikel apa pun`}
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
