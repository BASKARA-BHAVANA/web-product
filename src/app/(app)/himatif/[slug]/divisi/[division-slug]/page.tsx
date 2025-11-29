import Container from '@/components/molecules/container';
import { DivisionMemberCard } from '@/components/organisms/division-widgets';
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/components/atoms/magicui/scroll-based-velocity';
import Image from 'next/image';
import { ExceptionOverlay } from '@/components/molecules/exception';
import { prisma } from '@/lib/prisma';
import AdminView from '@/components/molecules/admin-view';
import { Button } from '@/components/atoms/button';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { deleteDivision } from '../actions';

const Page = async (props: {
  params: Promise<{ slug: string; 'division-slug': string }>;
}) => {
  const params = await props.params;
  const division = await prisma.division.findFirst({
    where: {
      cabinet: { slug: params.slug },
      slug: params['division-slug'],
    },
    include: {
      cabinet: {
        select: { name: true },
      },
      members: true,
    },
  });

  if (!division) return <ExceptionOverlay title="Divisi tidak ditemukan" />;

  return (
    <>
      <AdminView className="m-3">
        <form
          action={async () => {
            'use server';
            await deleteDivision(division.id);
          }}
        >
          <Button variant={'outline'} size={'sm'}>
            <Trash2Icon />
            Hapus
          </Button>
        </form>
        <Button variant={'outline'} size={'sm'} asChild>
          <Link href={`${division.slug}/edit`}>
            <Edit2Icon />
            Edit
          </Link>
        </Button>
      </AdminView>

      <Container className="flex flex-col gap-4 pb-24 lg:flex-row lg:items-center lg:justify-center">
        <div className="aspect-square max-w-60 grow lg:max-w-sm">
          <Image
            src={division.logoPath ?? ''}
            className="size-full object-contain drop-shadow-md"
            width={1080}
            height={1080}
            alt={''}
          />
        </div>
        <div className="max-w-2xl grow">
          <div className="bg-primary flex w-fit translate-y-3 items-center gap-2 rounded-lg rounded-bl-none p-3 px-3">
            <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
              {division.cabinet.name}
            </p>
            <p className="typo-large">Divisi</p>
          </div>
          <div className="bg-primary mb-4 flex w-fit items-center gap-2 rounded-lg rounded-tl-none p-3">
            <h1 className="typo-h1">{division.name}</h1>
          </div>
          <p className="typo-p px-3">{division.description}</p>
        </div>
      </Container>

      <Container>
        <div className="from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-1/3 bg-gradient-to-r to-transparent"></div>
        <div className="from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-1/3 bg-gradient-to-l to-transparent"></div>

        <ScrollVelocityContainer className="text-muted-foreground text-5xl uppercase">
          <ScrollVelocityRow baseVelocity={20} className="mb-3" direction={1}>
            {division.tagline} •
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={20} direction={-1}>
            {division.tagline} •
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
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
          {division.members.map((dat, i) => (
            <DivisionMemberCard key={i} data={dat} />
          ))}
        </div>
      </Container>
    </>
  );
};

export default Page;
