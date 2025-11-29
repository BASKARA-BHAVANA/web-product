import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import AdminView from '@/components/molecules/admin-view';
import Container from '@/components/molecules/container';
import { ExceptionOverlay } from '@/components/molecules/exception';
import { FlashActionResult } from '@/components/molecules/flash';
import Headline from '@/components/molecules/headline';
import { EllipsisPagination } from '@/components/molecules/pagination';
import { WorkProgramCard } from '@/components/organisms/workprogram-widgets';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Page = async (props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string; page?: number; limit?: number }>;
}) => {
  const params = await props.params;
  const { search = '', limit = 10, page = 1 } = await props.searchParams;
  const skip = (page - 1) * limit;

  const cabinet = await prisma.cabinet.findFirst({
    where: { slug: params.slug },
    select: {
      name: true,
    },
  });

  const where: Prisma.WorkProgramWhereInput | undefined = search
    ? {
        cabinet: { slug: params.slug },
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : undefined;

  const [programs, total] = await Promise.all([
    prisma.workProgram.findMany({
      where,
      skip,
      take: limit,
      select: {
        cabinet: { select: { slug: true } },
        title: true,
        slug: true,
        startDate: true,
        endDate: true,
        picturePath: true,
        isPinned: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.workProgram.count({
      where,
    }),
  ]);

  return (
    <>
      <Container className="max-w-3xl py-12">
        <FlashActionResult />

        <Headline
          className="mb-12 items-center"
          largeTexts={[cabinet?.name ?? '', 'Program Kerja']}
          headText="Langkah Nyata Kami"
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
            <Link href={`/himatif/${params.slug}/program-kerja/0/tambah`}>
              <PlusIcon />
              Program baru
            </Link>
          </Button>
        </AdminView>
      </Container>

      <Container>
        {programs.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs?.map((dat, i) => <WorkProgramCard key={i} data={dat} />)}
          </div>
        ) : (
          <ExceptionOverlay
            title="Program kerja tidak ditemukan"
            subtitle={`Pencarian "${search}" tidak cocok dengan program apa pun`}
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
