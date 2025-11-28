import Container from '@/components/molecules/container';
import { Input } from '@/components/atoms/input';
import { prisma } from '@/lib/prisma';
import { EllipsisPagination } from '@/components/molecules/pagination';
import Headline from '@/components/molecules/headline';
import { ExceptionOverlay } from '@/components/molecules/exception';
import { ArticleCard } from '@/components/organisms/article-widgets';
import { Prisma } from '@/generated/prisma';
import { Button } from '@/components/atoms/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import AdminView from '@/components/molecules/admin-view';

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
      orderBy: { createdAt: 'desc' },
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

        <AdminView className="mt-3">
          <Button variant={'outline'} size={'sm'} asChild>
            <Link href={'/artikel/0/tambah'}>
              <PlusIcon />
              Artikel baru
            </Link>
          </Button>
        </AdminView>
      </Container>

      <Container>
        {articles.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
