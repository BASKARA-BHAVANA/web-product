import { prisma } from '@/lib/prisma';
import Form from '../form';
import { auth } from '@/lib/actions/auth';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  await auth(['ADMIN', 'SUPERADMIN']);
  const { slug } = await props.params;

  const parentData = slug
    ? await prisma.course.findUnique({
        where: { slug },
        select: { id: true, title: true },
      })
    : undefined;

  return <Form parentData={parentData ?? undefined} />;
};

export default Page;
