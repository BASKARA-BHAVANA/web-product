import { ExceptionOverlay } from '@/components/molecules/exception';
import Form from '../form';
import { auth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  await auth(['ADMIN', 'SUPERADMIN']);

  const cabinet = await prisma.cabinet.findFirst({
    where: { slug: params.slug },
    include: { divisions: { select: { id: true, name: true } } },
  });
  if (!cabinet) return <ExceptionOverlay title="Kabinet tidak ditemukan" />;
  return <Form cabinet={cabinet} divisions={cabinet.divisions} />;
};

export default Page;
