import { ExceptionOverlay } from '@/components/molecules/exception';
import Form from '../form';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  await auth(['ADMIN', 'SUPERADMIN']);
  const { slug } = await props.params;

  const article = await prisma.article.findUnique({
    where: { slug },
  });
  if (!article) return <ExceptionOverlay title="Artikel tidak ditemukan" />;
  return <Form data={article} />;
};

export default Page;
