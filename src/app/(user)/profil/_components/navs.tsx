'use client';

import { Button } from '@/components/atoms/button';
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
    </>
  );
};

export default Navs;
