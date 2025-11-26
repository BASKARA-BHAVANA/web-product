import Image from 'next/image';
import React from 'react';
import { Button } from '../atoms/button';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { Cabinet, Division } from '@/generated/prisma';

interface DivisionCardProps {
  cabinetSlug?: Cabinet['slug'];
  data: Pick<Division, 'logoPath' | 'name' | 'tagline' | 'slug'>;
}

const DivisionCard = ({ cabinetSlug, data }: DivisionCardProps) => {
  return (
    <div className="group flex flex-col items-center gap-3 p-6 transition-all select-none">
      {data.logoPath && (
        <Image
          src={data.logoPath}
          width={500}
          height={500}
          alt=""
          className="w-1/2 drop-shadow-lg transition-all group-hover:scale-110 group-hover:-rotate-6"
        />
      )}
      <div className="relative w-full text-center">
        <p className="typo-h3">{data.name}</p>
        <small className="typo-small text-muted-foreground">
          {data.tagline}
        </small>
        <div className="bg-card group-hover:shadow-primary absolute top-0 left-1/2 -z-10 h-full -translate-x-1/2 rounded-md transition-all group-hover:w-2/3 group-hover:scale-y-150 group-hover:shadow-xl"></div>
      </div>
      <Button
        variant={'outline'}
        className="transition-transform group-hover:translate-y-4"
        asChild
      >
        <Link href={`${cabinetSlug}/divisi/${data.slug}`}>
          Selengkapnya
          <ArrowRightIcon className="transition-all group-hover:-rotate-45" />
        </Link>
      </Button>
    </div>
  );
};

export { DivisionCard };
