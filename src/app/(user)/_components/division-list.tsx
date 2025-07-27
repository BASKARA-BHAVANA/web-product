import { Division } from '@/generated/prisma';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/atoms/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Button } from '@/components/atoms/button';
import { ArrowRightIcon, ClipboardListIcon, UsersIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Separator } from '@/components/atoms/separator';
import Link from 'next/link';

interface Props {
  list: Partial<
    Division & {
      cabinet: {
        slug: string;
      };
      _count: {
        programs: number;
        members: number;
      };
    }
  >[];
}
const DivisionList = ({ list }: Props) => {
  const stats = useMemo(
    () => ({
      members: list.reduce((a, c) => (a += c._count?.members ?? 0), 0),
      programs: list.reduce((a, c) => (a += c._count?.programs ?? 0), 0),
    }),
    [list]
  );

  return (
    <>
      <div className="mb-12 flex flex-col items-center">
        <div className="bg-primary rounded-t-lg px-3 pt-3">
          <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
            Divisi Kami
          </p>
        </div>

        <h1 className="typo-h1 bg-primary w-fit rounded-lg p-3">
          Bersama Mewujudkan Tujuan
        </h1>
      </div>

      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
      >
        <div className="from-background via-background/50 pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent lg:w-40"></div>
        <div className="from-background via-background/50 pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-24 bg-gradient-to-l to-transparent lg:w-40"></div>
        <CarouselContent>
          {list.map((dat, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
              <div className="group flex flex-col items-center gap-3 p-6 transition-all select-none">
                {dat.logo && (
                  <Image
                    src={dat.logo}
                    width={500}
                    height={500}
                    alt=""
                    className="w-1/2 drop-shadow-lg transition-all group-hover:scale-125 group-hover:-rotate-12"
                  />
                )}
                <div className="relative w-full text-center">
                  <p className="typo-h3">{dat.name}</p>
                  <small className="typo-small text-muted-foreground">
                    {dat.tagline}
                  </small>
                  <div className="bg-card shadow-primary absolute top-0 left-1/2 -z-10 h-full -translate-x-1/2 rounded-md transition-all group-hover:w-2/3 group-hover:scale-y-200 group-hover:shadow-lg"></div>
                </div>
                <Button variant={'outline'} asChild>
                  <Link href={`${dat.cabinet?.slug}/divisi/${dat.slug}`}>
                    Selengkapnya{' '}
                    <ArrowRightIcon className="transition-all group-hover:-rotate-45" />
                  </Link>
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>

      <Separator className="my-24" />

      <div className="flex flex-wrap items-center justify-evenly gap-12">
        <div className="relative flex items-end gap-3">
          <UsersIcon
            size={120}
            className="text-primary absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-50"
          />
          <h1 className="typo-h1 !text-8xl">{stats.members}</h1>
          <p className="typo-lead text-muted-foreground pb-3">Anggota aktif</p>
        </div>
        <div className="relative flex items-end gap-3">
          <ClipboardListIcon
            size={120}
            className="text-primary absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-50"
          />
          <h1 className="typo-h1 !text-8xl">{stats.programs}</h1>
          <p className="typo-lead text-muted-foreground pb-3">Program kerja</p>
        </div>
      </div>
    </>
  );
};

export default DivisionList;
