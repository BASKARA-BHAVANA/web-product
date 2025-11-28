import Image from 'next/image';
import React from 'react';
import { Button } from '../atoms/button';
import Link from 'next/link';
import {
  ArrowRightIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'lucide-react';
import { Cabinet, Division, DivisionMember } from '@/generated/prisma';
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/avatar';
import { getInitials } from '@/utils/string';

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
        <Link href={`/himatif/${cabinetSlug}/divisi/${data.slug}`}>
          Selengkapnya
          <ArrowRightIcon className="transition-all group-hover:-rotate-45" />
        </Link>
      </Button>
    </div>
  );
};

interface DivisionMemberCardProps {
  data: DivisionMember;
}

const DivisionMemberCard = ({ data }: DivisionMemberCardProps) => {
  return (
    <div className="group flex flex-col items-center gap-3 p-6 transition-all select-none">
      <Avatar className="size-40 origin-bottom transition-all group-hover:scale-110">
        <AvatarImage src={data.picturePath ?? ''} />
        <AvatarFallback className="typo-h1">
          {getInitials(data.name)}
        </AvatarFallback>
      </Avatar>
      <div className="relative w-full text-center">
        <p className="typo-h3">{data.name}</p>
        <small className="typo-small text-muted-foreground">
          {data.position}
        </small>
        <div className="bg-card group-hover:shadow-primary absolute top-0 left-1/2 -z-10 h-full -translate-x-1/2 rounded-md transition-all group-hover:w-2/3 group-hover:scale-y-150 group-hover:shadow-xl"></div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant={'outline'}
          className="transition-transform group-hover:translate-y-1 group-hover:scale-125 group-hover:-rotate-12"
          size={'icon'}
        >
          <InstagramIcon />
        </Button>
        <Button
          variant={'outline'}
          className="transition-transform group-hover:translate-y-3 group-hover:scale-105 group-hover:rotate-3"
          size={'icon'}
        >
          <TwitterIcon />
        </Button>
        <Button
          variant={'outline'}
          className="transition-transform group-hover:translate-y-2 group-hover:scale-110 group-hover:rotate-12"
          size={'icon'}
        >
          <LinkedinIcon />
        </Button>
      </div>
    </div>
  );
};

export { DivisionCard, DivisionMemberCard };
