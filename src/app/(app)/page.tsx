import { Button } from '@/components/atoms/button';
import { Card, CardContent } from '@/components/atoms/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/atoms/carousel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/components/atoms/magicui/scroll-based-velocity';
import AdminView from '@/components/molecules/admin-view';
import Container from '@/components/molecules/container';
import { ExceptionOverlay } from '@/components/molecules/exception';
import Headline from '@/components/molecules/headline';
import ZoomInImage from '@/components/molecules/zoomin-image';
import { ArticleCard } from '@/components/organisms/article-widgets';
import { CabinetContactCard } from '@/components/organisms/cabinet-widgets';
import { DivisionCard } from '@/components/organisms/division-widgets';
import { prisma } from '@/lib/prisma';
import { cn } from '@/utils/misc';
import {
  ArrowUpRightIcon,
  ChevronsUpDownIcon,
  ClipboardListIcon,
  Edit2Icon,
  PlusIcon,
  Trash2Icon,
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
        orderBy: { name: 'asc' },
      },
      contacts: true,
      _count: { select: { programs: true } },
    },
  });

  const cabinets = await prisma.cabinet.findMany({
    select: {
      slug: true,
      logoPath: true,
      name: true,
      startYear: true,
      endYear: true,
    },
    orderBy: {
      startYear: 'desc',
    },
  });

  const articles = await prisma.article.findMany({
    select: { title: true, slug: true, tags: true, picturePath: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return (
    <>
      <AdminView className="m-3">
        {!!cabinet && (
          <>
            <Button variant={'outline'} size={'sm'}>
              <Trash2Icon />
              Hapus &quot;{cabinet.name}&quot;
            </Button>
            <Button variant={'outline'} size={'sm'} asChild>
              <Link href={`/himatif/${cabinet.slug}/edit`}>
                <Edit2Icon />
                Edit &quot;{cabinet.name}&quot;
              </Link>
            </Button>
          </>
        )}

        <Button variant={'outline'} size={'sm'} asChild>
          <Link href={'/himatif/0/tambah'}>
            <PlusIcon />
            Kabinet baru
          </Link>
        </Button>
      </AdminView>

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="mb-3" variant="outline">
                  Kabinet lainnya <ChevronsUpDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72">
                {cabinets.map((data, i) => (
                  <DropdownMenuItem
                    key={i}
                    className={cn(
                      data.slug == cabinet.slug ? '!bg-primary' : ''
                    )}
                  >
                    <Link
                      href={'/?kabinet=' + data.slug}
                      className={'flex items-center gap-3'}
                    >
                      <Image
                        width={80}
                        height={80}
                        alt=""
                        src={data.logoPath ?? ''}
                        className="size-8 object-contain"
                      />
                      <div>
                        <p className="typo-large">{data.name}</p>
                        <p className="typo-small text-muted-foreground mb-1">
                          {data.startYear}/{data.endYear}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Headline
              className="mb-3"
              largeTexts={['Himatif', 'Kabinet']}
              headText={cabinet.name}
            />
            <p className="typo-p mb-3 px-3">{cabinet?.description}</p>
            <p className="text-muted-foreground typo-large px-3">
              Periode {cabinet?.startYear}/{cabinet?.endYear}
            </p>
          </div>
        </Container>
      )}

      {!!cabinet && (
        <Container>
          <div className="from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-1/3 bg-gradient-to-r to-transparent"></div>
          <div className="from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-1/3 bg-gradient-to-l to-transparent"></div>

          <ScrollVelocityContainer className="text-muted-foreground text-5xl uppercase">
            <ScrollVelocityRow baseVelocity={20} className="mb-6" direction={1}>
              {cabinet.tagline} •
            </ScrollVelocityRow>
            <ScrollVelocityRow baseVelocity={20} direction={-1}>
              {cabinet.tagline} •
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
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
      {cabinet && (
        <Container className="py-24">
          <div className="mb-12 flex flex-wrap items-center justify-between gap-3">
            <Headline
              largeTexts={['Divisi Kami']}
              headText="Bersama Mewujudkan Tujuan"
            />
            <AdminView>
              <Button variant={'outline'} size={'sm'} asChild>
                <Link href={`/himatif/${cabinet.slug}/divisi/0/tambah`}>
                  <PlusIcon />
                  Divisi baru
                </Link>
              </Button>
            </AdminView>
          </div>
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
              <CardContent>
                <h4 className="typo-p">{cabinet.vision}</h4>
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
              <CardContent>
                <div className="flex flex-col items-end gap-3">
                  {cabinet.mission.split('\n').map((dat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-6 border-b pb-3"
                    >
                      <p className="typo-p text-end">{dat}</p>
                      <h1 className="typo-h1 text-muted-foreground w-6 opacity-50">
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
