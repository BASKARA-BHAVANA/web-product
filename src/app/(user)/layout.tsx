import { Button } from '@/components/atoms/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/atoms/sheet';
import BrandLogo from '@/components/molecules/brand-logo';
import Container from '@/components/molecules/container';
import { MenuIcon, ShieldIcon, UserIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Footer from './_components/footer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { getInitials } from '@/utils/string';

const Navs = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Button variant={'ghost'} asChild>
        <Link href={'berita'}>Berita</Link>
      </Button>
      <Button variant={'ghost'} asChild>
        <Link href={'acara'}>Acara</Link>
      </Button>
      <Button variant={'ghost'} asChild>
        <Link href={'materi-belajar'}>Materi belajar</Link>
      </Button>
      {session?.user != null && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-10 cursor-pointer">
              <AvatarImage src={session.user.image ?? ''} />
              <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={'profil'}>
                <UserIcon />
                Profil
              </Link>
            </DropdownMenuItem>
            {(session?.user.role == 'ADMIN' ||
              session?.user.role == 'SUPERADMIN') && (
              <DropdownMenuItem asChild>
                <Link href={'admin'}>
                  <ShieldIcon />
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
          <div className="hidden items-center gap-4 sm:flex">
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
