import { ExceptionOverlay } from '@/components/molecules/exception';
import Form from '../form';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';

const Page = async (props: {
  params: Promise<{ slug: string; 'division-slug': string }>;
}) => {
  await auth(['ADMIN', 'SUPERADMIN']);
  const params = await props.params;

  const division = await prisma.division.findFirst({
    where: { slug: params['division-slug'], cabinet: { slug: params.slug } },
    include: { members: true, cabinet: true },
  });
  if (!division) return <ExceptionOverlay title="Divisi tidak ditemukan" />;
  return <Form data={division} cabinet={division.cabinet} />;
};

export default Page;
