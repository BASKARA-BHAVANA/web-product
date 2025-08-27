'use client';

import 'react-quill-new/dist/quill.snow.css';
import { getWorkProgramPageData } from '@/app/(user)/actions';
import Container from '@/components/molecules/container';
import ZoomOutImage from '@/components/molecules/zoomout-image';
import { getUploaded } from '@/utils/misc';
import Image from 'next/image';
import React from 'react';

const View = ({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getWorkProgramPageData>>['data']>;
}) => {
  const { workProgram, cabinet, division } = data;

  return (
    <>
      <Container>
        <div className="mb-6 flex flex-col items-center -space-y-3">
          <div className="bg-primary flex items-center gap-3 rounded-lg p-3">
            <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
              Program Kerja
            </p>
          </div>
          <h1 className="typo-h1 bg-primary w-fit rounded-lg p-3 text-center">
            {workProgram.title}
          </h1>
        </div>
        <p className="typo-p text-muted-foreground mb-6 text-center">
          {workProgram.description}
        </p>
      </Container>
      {workProgram.picture && (
        <ZoomOutImage src={getUploaded(workProgram.picture)} />
      )}
      <Container>
        <div className="mb-6 flex flex-wrap justify-evenly gap-6">
          {cabinet && (
            <div className="flex items-center gap-3">
              <div className="size-20">
                <Image
                  src={getUploaded(cabinet?.logo)}
                  className="drop-shadow-foreground size-full drop-shadow-sm"
                  alt=""
                  width={1000}
                  height={1000}
                />
              </div>
              <div className="grid -space-y-1">
                <p className="typo-p text-muted-foreground">Kabinet</p>
                <h4 className="typo-h4">{cabinet.name}</h4>
              </div>
            </div>
          )}
          {division && (
            <div className="flex items-center gap-3">
              <div className="size-20">
                <Image
                  src={getUploaded(division?.logo)}
                  className="drop-shadow-foreground size-full drop-shadow-sm"
                  alt=""
                  width={1000}
                  height={1000}
                />
              </div>
              <div className="grid -space-y-1">
                <p className="typo-p text-muted-foreground">Divisi</p>
                <h4 className="typo-h4">{division.name}</h4>
              </div>
            </div>
          )}
        </div>

        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: workProgram.content ?? '' }}
        ></div>
      </Container>
    </>
  );
};

export default View;
