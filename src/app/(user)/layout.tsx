import { Button } from '@/components/atoms/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/atoms/sheet';
import BrandLogo from '@/components/molecules/brand-logo';
import Container from '@/components/molecules/container';
import {
  BookOpenTextIcon,
  CalendarFoldIcon,
  MenuIcon,
  ShieldUserIcon,
  UserIcon,
} from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Footer from './_components/footer';

const Navs = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Button variant={'ghost'} asChild>
        <Link href={'materi-belajar'}>
          <BookOpenTextIcon />
          Materi belajar
        </Link>
      </Button>
      <Button variant={'ghost'} asChild>
        <Link href={'event'}>
          <CalendarFoldIcon />
          Event
        </Link>
      </Button>
      {session?.user != null && (
        <Button variant={'ghost'} asChild>
          <Link href={'profil'}>
            <UserIcon />
            Profil
          </Link>
        </Button>
      )}
      {(session?.user.role == 'ADMIN' ||
        session?.user.role == 'SUPERADMIN') && (
        <Button variant={'ghost'} asChild>
          <Link href={'admin'}>
            <ShieldUserIcon />
            Admin
          </Link>
        </Button>
      )}
    </>
  );
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* header & navigations  */}
      <header className="bg-background sticky top-0 left-0 z-50 flex shadow">
        <Container className="flex items-center gap-4 py-4">
          {/* brand  */}
          <BrandLogo />

          <div className="grow"></div>

          {/* (tablet, desktop) navs  */}
          <div className="hidden gap-4 sm:flex">
            <Navs />
          </div>

          {/* login  */}
          {!session?.user && (
            <Button>
              <Link href={'auth/login'}>Login</Link>
            </Button>
          )}

          {/* (mobile) sidebar navs */}
          <Sheet>
            <SheetTrigger asChild>
              {/* open sidebar  */}
              <Button className="sm:hidden" variant={'outline'}>
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="items-start p-4">
              {/* brand  */}
              <div className="mb-8">
                <BrandLogo />
              </div>
              {/* navs  */}
              <div className="flex w-full flex-col gap-2 [&>*]:justify-start">
                <Navs />
              </div>
            </SheetContent>
          </Sheet>
        </Container>
      </header>
      <div className="flex min-h-screen flex-col items-start">{children}</div>
      <Footer />
    </>
  );
}
