import { logoHimatif, LogoInformatics } from '@/assets/images';
import Image from 'next/image';
import Link from 'next/link';

const BrandLogo = () => {
  return (
    <Link href={'/'} className="flex items-center gap-4">
      <Image src={LogoInformatics} alt="" className="size-12" />
      <Image src={logoHimatif} alt="" className="size-12" />
    </Link>
  );
};

export default BrandLogo;
