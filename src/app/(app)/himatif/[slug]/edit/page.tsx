import { ExceptionOverlay } from '@/components/molecules/exception';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/actions/auth';
import FormCabinet from '../forms/form-cabinet';
import Container from '@/components/molecules/container';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  await auth(['ADMIN', 'SUPERADMIN']);
  const { slug } = await props.params;

  const cabinet = await prisma.cabinet.findFirst({
    where: { slug },
    include: { contacts: true },
  });
  if (!cabinet) return <ExceptionOverlay title="Kabinet tidak ditemukan" />;
  return (
    <Container>
      <FormCabinet data={cabinet} />
    </Container>
  );
};

export default Page;
