import { Cabinet, Division, WorkProgram } from '@/generated/prisma';
import { AspectRatio } from '../atoms/aspect-ratio';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../atoms/card';
import { ArrowRightIcon, StarIcon } from 'lucide-react';
import { Button } from '../atoms/button';
import Link from 'next/link';

interface WorkProgramCardDefaultProps {
  program: Pick<WorkProgram, 'title' | 'slug' | 'picture' | 'isPinned'> & {
    division: Pick<Division, 'name' | 'slug'> | null;
    cabinet: Pick<Cabinet, 'slug'> | null;
  };
}

const WorkProgramCardDefault = ({ program }: WorkProgramCardDefaultProps) => {
  return (
    <div className="group flex flex-col -space-y-12">
      <div className="w-full px-6">
        <AspectRatio
          className="group-hover:shadow-primary w-full origin-bottom overflow-hidden rounded-lg transition-all group-hover:scale-105 group-hover:shadow-xl"
          ratio={3 / 2}
        >
          <Image
            src={program.picture ?? ''}
            width={1080}
            height={1080}
            alt=""
            className="size-full object-cover"
          />
        </AspectRatio>
      </div>
      <Card>
        <CardHeader className="pt-12">
          <CardTitle>{program.title}</CardTitle>
          <CardDescription>{program.division?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-3">
            <Button variant={'outline'} asChild>
              <Link
                href={`/${program.cabinet?.slug}/program-kerja/${program.slug}`}
              >
                Selengkapnya{' '}
                <ArrowRightIcon className="transition-all group-hover:-rotate-45" />
              </Link>
            </Button>
            {program.isPinned && (
              <div className="bg-primary text-primary-foreground rounded-lg p-2">
                <StarIcon />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { WorkProgramCardDefault };
