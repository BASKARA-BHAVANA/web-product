'use client';

import React from 'react';
import { getHomePageData } from './actions';
import Image from 'next/image';
import Container from '@/components/molecules/container';
import { Button } from '@/components/atoms/button';
import { ChevronsUpDownIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { useRouter } from 'next/navigation';
import DivisionList from './_components/division-list';
import ZoomOutImage from '@/components/molecules/zoomout-image';
import VisionMissions from './_components/vision-missions';
import WorkProgramList from './_components/workprogram-list';
import ContactList from './_components/contact-list';

const View = ({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getHomePageData>>['data']>;
}) => {
  const router = useRouter();

  const _switchCabinet = (slug: string) => {
    router.replace(`?kabinet=${slug}`, { scroll: true });
  };

  return (
    <>
      {/* HERO  */}
      <Container className="flex flex-col gap-4 pb-24 lg:flex-row lg:items-center">
        <div className="aspect-square max-w-80 grow lg:max-w-xl">
          <Image
            src={data.cabinet.logo}
            className="drop-shadow-foreground size-full object-contain drop-shadow-md"
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
            <h1 className="typo-h1">{data.cabinet.name}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                  <ChevronsUpDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup
                  value={data.cabinet.slug}
                  onValueChange={_switchCabinet}
                >
                  {data.cabinets.map((c, i) => (
                    <DropdownMenuRadioItem key={i} value={c.slug}>
                      {c.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="typo-p mb-4 px-3">{data.cabinet.description}</p>
          <p className="text-muted-foreground px-3">
            Periode {data.cabinet.periode}
          </p>
        </div>
      </Container>

      {/* PRIMARY IMAGE  */}
      <ZoomOutImage src={data.cabinet.primaryImage} />

      {/* DIVISIONS  */}
      <Container className="py-24">
        <DivisionList list={data.cabinet.divisions} />
      </Container>

      {/* VISION MISSION  */}
      <Container className="py-24">
        <VisionMissions
          vision={data.cabinet.vision}
          missions={data.cabinet.mission.split('\n')}
        />
      </Container>

      {/* PINNED WORK PROGRAMS  */}
      <Container className="py-24">
        <WorkProgramList programs={data.cabinet.programs} />
      </Container>

      {/* SEcONDARY IMAGE  */}
      <ZoomOutImage src={data.cabinet.secondaryImage} />

      {/* CONTACT  */}
      <Container className="py-24">
        <ContactList contacts={data.cabinet.contacts} />
      </Container>
    </>
  );
};

export default View;
