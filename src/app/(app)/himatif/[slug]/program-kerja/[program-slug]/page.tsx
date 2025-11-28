import Container from '@/components/molecules/container';
import Image from 'next/image';
import { ExceptionOverlay } from '@/components/molecules/exception';
import { prisma } from '@/lib/prisma';
import AdminView from '@/components/molecules/admin-view';
import { Button } from '@/components/atoms/button';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import ZoomInImage from '@/components/molecules/zoomin-image';
import Headline from '@/components/molecules/headline';
import { formatTime } from '@/utils/date';

const Page = async (props: {
  params: Promise<{ slug: string; 'program-slug': string }>;
}) => {
  const params = await props.params;
  const program = await prisma.workProgram.findFirst({
    where: {
      cabinet: { slug: params.slug },
      slug: params['program-slug'],
    },
    include: {
      cabinet: {
        select: { slug: true, logoPath: true, name: true },
      },
      division: {
        select: { slug: true, logoPath: true, name: true },
      },
    },
  });

  if (!program)
    return <ExceptionOverlay title="Program kerja tidak ditemukan" />;

  return (
    <>
      <AdminView className="m-3">
        <Button variant={'outline'} size={'sm'}>
          <Trash2Icon />
          Hapus
        </Button>
        <Button variant={'outline'} size={'sm'} asChild>
          <Link href={`${program.slug}/edit`}>
            <Edit2Icon />
            Edit
          </Link>
        </Button>
      </AdminView>

      <Container className="flex flex-col items-center">
        <div className="relative mb-6">
          <Headline
            className="items-center"
            largeTexts={['Program Kerja']}
            headText={program.title}
          />
          {program.isPinned && (
            <div className="bg-destructive text-background absolute -right-4 -bottom-4 origin-center -rotate-12 px-2 text-center font-sans font-bold uppercase">
              Terbaik
            </div>
          )}
        </div>
        <div className="mb-6 flex w-full flex-wrap justify-evenly gap-6">
          {program.cabinet && (
            <div className="flex items-center gap-3">
              <div className="size-20">
                <Image
                  src={program.cabinet?.logoPath ?? ''}
                  className="drop-shadow-foreground size-full drop-shadow-sm"
                  alt=""
                  width={1000}
                  height={1000}
                />
              </div>
              <div className="grid -space-y-1">
                <p className="typo-p text-muted-foreground">Kabinet</p>
                <h4 className="typo-h4">{program.cabinet.name}</h4>
              </div>
            </div>
          )}
          {program.division && (
            <div className="flex items-center gap-3">
              <div className="size-20">
                <Image
                  src={program.division?.logoPath ?? ''}
                  className="drop-shadow-foreground size-full drop-shadow-sm"
                  alt=""
                  width={1000}
                  height={1000}
                />
              </div>
              <div className="grid -space-y-1">
                <p className="typo-p text-muted-foreground">Divisi</p>
                <h4 className="typo-h4">{program.division.name}</h4>
              </div>
            </div>
          )}
        </div>
        <p className="typo-p mb-3 text-center">{program.description}</p>
        <p className="typo-p bg-secondary text-secondary-foreground mb-12 rounded-md px-3 uppercase">
          {program.startDate
            ? formatTime(program.startDate, 'DD MMM YYYY')
            : ''}
          {program.endDate
            ? ' s.d ' + formatTime(program.endDate, 'DD MMM YYYY')
            : ''}
        </p>
      </Container>

      {program.picturePath && <ZoomInImage src={program.picturePath} />}

      <Container>
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: program.content ?? '' }}
        ></div>
      </Container>
    </>
  );
};

export default Page;
