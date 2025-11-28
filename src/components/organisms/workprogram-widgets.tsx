import { Cabinet, WorkProgram } from '@/generated/prisma';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../atoms/card';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '../atoms/button';
import Link from 'next/link';
import { PlaceholderImage } from '@/assets/images';
import { formatTime } from '@/utils/date';

interface WorkProgramCardDefaultProps {
  data: Pick<
    WorkProgram,
    'title' | 'slug' | 'picturePath' | 'startDate' | 'endDate' | 'isPinned'
  > & {
    cabinet: Pick<Cabinet, 'slug'> | null;
  };
}

const WorkProgramCard = ({ data }: WorkProgramCardDefaultProps) => {
  return (
    <div className="group flex flex-col -space-y-12">
      <div className="w-full px-6">
        <Image
          src={data.picturePath ?? PlaceholderImage}
          width={1080}
          height={1080}
          alt=""
          className="group-hover:shadow-primary relative z-10 aspect-video w-full origin-bottom overflow-hidden rounded-lg object-cover transition-all group-hover:scale-105 group-hover:shadow-xl"
        />
      </div>
      <Card>
        <CardHeader className="pt-12">
          <CardTitle>{data.title}</CardTitle>
          <CardDescription>
            {data.startDate ? formatTime(data.startDate, 'DD MMM YYYY') : ''}
            {data.endDate
              ? ' s.d ' + formatTime(data.endDate, 'DD MMM YYYY')
              : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="mt-3 flex justify-between gap-3">
            <Button asChild>
              <Link
                href={`/himatif/${data.cabinet?.slug ?? '0'}/program-kerja/${data.slug}`}
              >
                Selengkapnya{' '}
                <ArrowRightIcon className="transition-all group-hover:-rotate-45" />
              </Link>
            </Button>
            {data.isPinned && (
              <div className="bg-destructive text-background absolute -right-2/5 bottom-0 w-full -rotate-45 text-center font-sans font-bold uppercase">
                Terbaik
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { WorkProgramCard };
