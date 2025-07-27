import { Button } from '@/components/atoms/button';
import { WorkProgramCardDefault } from '@/components/molecules/workprogram-cards';
import { Cabinet, Division, WorkProgram } from '@/generated/prisma';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';

interface Props {
  programs: (Pick<WorkProgram, 'title' | 'slug' | 'picture' | 'isPinned'> & {
    division: Pick<Division, 'name' | 'slug'> | null;
    cabinet: Pick<Cabinet, 'slug'> | null;
  })[];
}

const WorkProgramList = ({ programs }: Props) => {
  return (
    <>
      <div className="mb-12 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col items-start">
          <div className="bg-primary rounded-t-lg px-3 pt-3">
            <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
              Program Unggulan
            </p>
          </div>
          <h1 className="typo-h1 bg-primary w-fit rounded-lg rounded-tl-none p-3">
            Langkah Nyata, Hasil Hebat
          </h1>
        </div>

        <Button variant={'ghost'} asChild>
          <Link href={`/${''}/program-kerja`}>
            Program lainnya <ArrowUpRightIcon />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((dat, i) => (
          <WorkProgramCardDefault key={i} program={dat} />
        ))}
      </div>
    </>
  );
};

export default WorkProgramList;
