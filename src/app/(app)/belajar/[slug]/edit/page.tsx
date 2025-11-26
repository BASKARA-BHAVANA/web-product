import { ExceptionOverlay } from '@/components/molecules/exception';
import Form from '../form';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  await auth(['ADMIN', 'SUPERADMIN']);
  const { slug } = await props.params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      course: { select: { id: true, title: true } },
    },
  });
  if (!course) return <ExceptionOverlay title="Materi tidak ditemukan" />;
  return <Form data={course} parentData={course.course ?? undefined} />;
};

export default Page;
