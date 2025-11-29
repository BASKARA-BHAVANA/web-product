import { MenuIcon } from 'lucide-react';
import BrandLogo from './brand-logo';
import Container from './container';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '../atoms/sheet';
import { Button } from '../atoms/button';
import { getServerSession } from 'next-auth';
import AuthButton from './auth-button';
import { authOptions } from '@/config/auth-options';

const Navs = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Button variant={'ghost'} asChild>
        <Link href={'/artikel'}>Artikel</Link>
      </Button>
      <Button variant={'ghost'} asChild>
        <Link href={'/belajar'}>Belajar</Link>
      </Button>
      {session?.user.role == 'SUPERADMIN' && (
        <Button variant={'ghost'} asChild>
          <Link href={'/admin'}>Superadmin</Link>
        </Button>
      )}
      <AuthButton session={session} />
    </>
  );
};

const Header = () => {
  return (
    <header className="bg-background border-primary-foreground sticky top-0 left-0 z-50 flex w-full border-b">
      <Container className="flex items-center gap-4 py-4">
        <BrandLogo />

        <div className="grow"></div>

        <div className="hidden items-center gap-3 sm:flex">
          <Navs />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="sm:hidden" variant={'outline'}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="items-start p-4">
            <div className="mb-8">
              <BrandLogo />
            </div>
            <div className="flex w-full flex-col gap-2 [&>*]:justify-start">
              <Navs />
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
};

export default Header;
