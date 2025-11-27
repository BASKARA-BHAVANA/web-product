import { Button } from '@/components/atoms/button';
import { Card, CardContent } from '@/components/atoms/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/atoms/carousel';
import AdminFab from '@/components/molecules/admin-fab';
import Container from '@/components/molecules/container';
import { ExceptionOverlay } from '@/components/molecules/exception';
import Headline from '@/components/molecules/headline';
import ZoomInImage from '@/components/molecules/zoomin-image';
import { ArticleCard } from '@/components/organisms/article-widgets';
import { CabinetContactCard } from '@/components/organisms/cabinet-widgets';
import { DivisionCard } from '@/components/organisms/division-widgets';
import { prisma } from '@/lib/prisma';
import {
  ArrowUpRightIcon,
  ClipboardListIcon,
  Edit2Icon,
  PlusIcon,
  UsersIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home(params: {
  searchParams: Promise<{ kabinet?: string }>;
}) {
  const sp = await params.searchParams;
  const cabinet = await prisma.cabinet.findFirst({
    where: sp.kabinet ? { slug: sp.kabinet } : { isActive: true },
    include: {
      divisions: {
        select: {
          id: true,
          name: true,
          slug: true,
          tagline: true,
          logoPath: true,
          _count: { select: { members: true } },
        },
      },
      contacts: true,
      _count: { select: { programs: true } },
    },
  });

  const articles = await prisma.article.findMany({
    select: { title: true, slug: true, tags: true, picturePath: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return (
    <>
      <AdminFab>
        {!!cabinet && (
          <Button>
            <Edit2Icon />
            Edit kabinet ini
          </Button>
        )}

        <Button>
          <PlusIcon />
          Kabinet baru
        </Button>
      </AdminFab>

      {!!cabinet && (
        <Container className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="aspect-square max-w-80 grow lg:max-w-xl">
            <Image
              src={cabinet?.logoPath ?? ''}
              className="size-full object-contain drop-shadow-lg"
              width={1080}
              height={1080}
              alt={''}
            />
          </div>
          <div className="max-w-2xl grow">
            <div className="bg-primary flex w-fit items-center gap-2 rounded-t-lg px-3 pt-3">
              <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
                Himatif
              </p>
              <p className="typo-large">Kabinet</p>
            </div>
            <div className="bg-primary mb-4 flex w-fit items-center gap-2 rounded-lg rounded-tl-none p-3">
              <h1 className="typo-h1">{cabinet?.name}</h1>
            </div>
            <p className="typo-p mb-4 px-3">{cabinet?.description}</p>
            <p className="text-muted-foreground px-3">
              Periode {cabinet?.startYear}/{cabinet?.endYear}
            </p>
          </div>
        </Container>
      )}

      {/* Recent articles  */}
      <Container className="py-24">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-3">
          <Headline largeTexts={['Artikel']} headText="Kabar Terkini Himatif" />

          <Button variant={'ghost'} asChild>
            <Link href={`/artikel`}>
              Lainnya <ArrowUpRightIcon />
            </Link>
          </Button>
        </div>

        {articles.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((dat, i) => (
              <ArticleCard key={i} data={dat} />
            ))}
          </div>
        ) : (
          <ExceptionOverlay title="Belum ada artikel" />
        )}
      </Container>

      {/* FIRST IMAGE  */}
      {cabinet?.firstImagePath && <ZoomInImage src={cabinet.firstImagePath} />}

      {/* DIVISIONS  */}
      {cabinet && cabinet.divisions.length > 0 && (
        <Container className="py-24">
          <Headline
            largeTexts={['Divisi Kami']}
            headText="Bersama Mewujudkan Tujuan"
            className="mb-12"
          />
          <Carousel>
            <div className="from-background via-background/50 pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent lg:w-40"></div>
            <div className="from-background via-background/50 pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l to-transparent lg:w-40"></div>
            <CarouselContent>
              {cabinet.divisions.map((dat, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <DivisionCard cabinetSlug={cabinet.slug} data={dat} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext />
            <CarouselPrevious />
          </Carousel>
          <div className="my-24" />
          <div className="flex flex-wrap items-center justify-evenly gap-12">
            <div className="relative flex items-end gap-3">
              <UsersIcon
                size={120}
                className="text-primary absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-50"
              />
              <h1 className="typo-h1 !text-8xl">
                {cabinet.divisions.reduce((a, c) => (a += c._count.members), 0)}
              </h1>
              <p className="typo-lead text-muted-foreground pb-3">
                Anggota aktif
              </p>
            </div>
            <div className="relative flex items-end gap-3">
              <ClipboardListIcon
                size={120}
                className="text-primary absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-50"
              />
              <h1 className="typo-h1 !text-8xl">{cabinet._count.programs}</h1>
              <p className="typo-lead text-muted-foreground pb-3">
                Program kerja
              </p>
            </div>
          </div>
        </Container>
      )}

      {/* VISION / MISSION  */}
      {!!cabinet && (
        <Container className="py-24">
          <div className="mb-12 max-w-3xl">
            <Headline
              className="ms-3"
              largeTexts={['Visi', 'Langkah Menuju Harapan']}
            />
            <Card>
              <CardContent className="pt-6">
                <h4 className="typo-p text-muted-foreground">
                  {cabinet.vision}
                </h4>
              </CardContent>
            </Card>
          </div>

          <div className="relative ms-auto max-w-3xl">
            <div className="flex">
              <Headline
                className="ms-auto me-3"
                largeTexts={['Misi', 'Upaya Mewujudkan Visi']}
              />
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-end gap-3">
                  {cabinet.mission.split('\n').map((dat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-6 border-b pb-3"
                    >
                      <p className="typo-p text-muted-foreground text-end">
                        {dat}
                      </p>
                      <h1 className="typo-h1 text-primary w-6 opacity-50">
                        {i + 1}
                      </h1>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      )}

      {/* SECONDARY IMAGE  */}
      {cabinet?.secondImagePath && (
        <ZoomInImage src={cabinet.secondImagePath} />
      )}

      {/* CONTACT  */}
      {!!cabinet && cabinet.contacts.length && (
        <Container className="py-24">
          <Headline
            className="mb-12 items-center"
            largeTexts={['Kontak Kami']}
            headText="Jangkau Kami Sekarang"
          />
          <div className="flex flex-wrap items-center justify-center gap-6">
            {cabinet.contacts.map((dat, i) => (
              <CabinetContactCard key={i} contact={dat} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
