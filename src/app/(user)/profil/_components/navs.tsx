'use client';

import { Button } from '@/components/atoms/button';
import ThemeToggle from '@/components/molecules/theme-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navs = () => {
  const pathname = usePathname();

  return (
    <>
      <Button variant={pathname == '/profil' ? 'secondary' : 'ghost'} asChild>
        <Link href={'/profil'}>Data pribadi</Link>
      </Button>
      <Button
        variant={pathname == '/profil/akun' ? 'secondary' : 'ghost'}
        asChild
      >
        <Link href={'/profil/akun'}>Akun</Link>
      </Button>
      <div className="mt-auto p-4">
        <ThemeToggle />
      </div>
    </>
  );
};

export default Navs;
