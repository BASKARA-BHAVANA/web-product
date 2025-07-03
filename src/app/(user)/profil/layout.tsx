import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Container from '@/components/molecules/container';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Navs from './_components/navs';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/auth/login');

  return (
    <>
      <Container>
        <h1 className="typo-h1">Profil</h1>
      </Container>

      <Container className="flex flex-col gap-8 md:flex-row">
        <div className="flex max-w-3xs grow flex-row gap-3 md:flex-col [&>*]:justify-start">
          <Navs />
        </div>
        <div className="grow">{children}</div>
      </Container>
    </>
  );
}
