'use client';

import React from 'react';
import { getHomePageData } from './actions';
import Image from 'next/image';
import Container from '@/components/molecules/container';
import { Button } from '@/components/atoms/button';
import { ChevronsUpDownIcon } from 'lucide-react';

const View = ({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getHomePageData>>['data']>;
}) => {
  return (
    <>
      {/* HERO  */}
      <div className="relative h-screen w-screen overflow-hidden">
        <Image
          src={data.cabinet.primaryImage}
          className="size-full object-cover"
          width={1080}
          height={1080}
          alt={''}
        />
        <div className="bg-background/80 absolute top-0 left-0 size-full"></div>
        <div className="absolute top-0 left-0 flex size-full">
          <Container className="m-auto flex flex-col gap-4 pb-32 lg:flex-row lg:items-center">
            <div className="aspect-square max-w-80 grow lg:max-w-xl">
              <Image
                src={data.cabinet.logo}
                className="drop-shadow-foreground size-full object-contain drop-shadow-xl"
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
                <Button size={'icon'} variant={'ghost'}>
                  <ChevronsUpDownIcon />
                </Button>
              </div>
              <p className="typo-p mb-4 px-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae
                ipsum, ea pariatur nesciunt omnis quos, nam ducimus porro
                similique aliquid unde labore totam tempore nemo libero
                obcaecati, magnam quae animi corporis placeat. Vero consectetur
                quisquam, culpa quos est nihil eum, saepe perspiciatis quibusdam
                velit qui quis excepturi corporis delectus necessitatibus fuga
                amet dignissimos expedita tenetur obcaecati. Eaque voluptatibus
                rem pariatur?
              </p>
              <p className="text-muted-foreground px-3">
                Periode {data.cabinet.periode}
              </p>
            </div>
          </Container>
        </div>
      </div>

      {/* DIVISIONS  */}
    </>
  );
};

export default View;
