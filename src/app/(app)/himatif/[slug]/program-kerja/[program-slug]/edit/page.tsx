import { ExceptionOverlay } from '@/components/molecules/exception';
import Form from '../form';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';

const Page = async (props: {
  params: Promise<{ slug: string; 'program-slug': string }>;
}) => {
  await auth(['ADMIN', 'SUPERADMIN']);
  const params = await props.params;

  const program = await prisma.workProgram.findFirst({
    where: { slug: params['program-slug'], cabinet: { slug: params.slug } },
    include: {
      cabinet: {
        select: {
          id: true,
          slug: true,
          name: true,
          logoPath: true,
          divisions: { select: { id: true, name: true } },
        },
      },
    },
  });
  if (!program)
    return <ExceptionOverlay title="Program kerja tidak ditemukan" />;
  return (
    <Form
      data={program}
      cabinet={program.cabinet}
      divisions={program.cabinet.divisions}
    />
  );
};

export default Page;
