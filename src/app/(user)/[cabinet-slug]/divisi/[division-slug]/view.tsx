import { getDivisionPageData } from '@/app/(user)/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { Button } from '@/components/atoms/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { VelocityScroll } from '@/components/atoms/magicui/scroll-based-velocity';
import Container from '@/components/molecules/container';
import { getUploaded } from '@/utils/misc';
import {
  ArrowUpRightIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const View = ({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getDivisionPageData>>['data']>;
}) => {
  return (
    <>
      <Container className="flex flex-col gap-4 pb-24 lg:flex-row lg:items-center">
        <div className="aspect-square max-w-60 grow lg:max-w-sm">
          <Image
            src={getUploaded(data.division.logo)}
            className="drop-shadow-foreground size-full object-contain drop-shadow-md"
            width={1080}
            height={1080}
            alt={''}
          />
        </div>
        <div className="max-w-2xl grow">
          <div className="bg-primary flex w-fit translate-y-3 items-center gap-2 rounded-lg rounded-bl-none p-3 px-3">
            <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
              {data.division.cabinet.name}
            </p>
            <p className="typo-large">Divisi</p>
          </div>
          <div className="bg-primary mb-4 flex w-fit items-center gap-2 rounded-lg rounded-tl-none p-3">
            <h1 className="typo-h1">{data.division.name}</h1>
          </div>
          <p className="typo-p mb-4 px-3">{data.division.description}</p>
        </div>
      </Container>

      <Container className="max-w-none">
        <VelocityScroll className="text-primary uppercase opacity-40">
          {data.division.tagline}
        </VelocityScroll>
      </Container>

      <Container className="py-24">
        <div className="mb-12 flex flex-col items-center">
          <div className="bg-primary rounded-t-lg px-3 pt-3">
            <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
              Anggota Divisi
            </p>
          </div>
          <h1 className="typo-h1 bg-primary w-fit rounded-lg p-3">
            Mereka yang Berperan
          </h1>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {data.members.map((dat, i) => (
            <div
              key={i}
              className="group flex flex-col items-center gap-3 p-6 transition-all select-none"
            >
              <Avatar className="size-40 origin-bottom transition-all group-hover:scale-110">
                <AvatarImage src={getUploaded(dat.picture)} />
                <AvatarFallback>{dat.fullName}</AvatarFallback>
              </Avatar>
              <div className="relative w-full text-center">
                <p className="typo-h3">{dat.fullName}</p>
                <small className="typo-small text-muted-foreground">
                  {dat.position}
                </small>
                <div className="bg-card shadow-primary absolute top-0 left-1/2 -z-10 h-full -translate-x-1/2 rounded-md transition-all group-hover:w-2/3 group-hover:scale-y-200 group-hover:shadow-lg"></div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant={'outline'} size={'icon'}>
                  <InstagramIcon />
                </Button>
                <Button variant={'outline'} size={'icon'}>
                  <TwitterIcon />
                </Button>
                <Button variant={'outline'} size={'icon'}>
                  <LinkedinIcon />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-24">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col items-start">
            <div className="bg-primary rounded-t-lg px-3 pt-3">
              <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
                Program Kerja
              </p>
            </div>
            <h1 className="typo-h1 bg-primary w-fit rounded-lg rounded-tl-none p-3">
              Bergerak dengan Rencana
            </h1>
          </div>

          <Button variant={'ghost'} asChild>
            <Link href={`/${data.division.cabinet.slug}/program-kerja`}>
              Program lainnya <ArrowUpRightIcon />
            </Link>
          </Button>
        </div>

        {data.programs.map((dat, i) => (
          <div key={i} className="mb-3 pe-3">
            <Card>
              <CardHeader>
                <CardTitle>{dat.title}</CardTitle>
                <CardDescription>{dat.description}</CardDescription>
                <CardAction>
                  <Button asChild>
                    <Link
                      href={`/${data.division.cabinet.slug}/program-kerja/${dat.slug}`}
                    >
                      Detail <ArrowUpRightIcon />
                    </Link>
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
          </div>
        ))}
      </Container>
    </>
  );
};

export default View;
