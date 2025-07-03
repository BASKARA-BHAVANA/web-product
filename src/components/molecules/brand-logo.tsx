import { logoHimatif, LogoInformatics } from '@/assets/images';
import Image from 'next/image';

const BrandLogo = () => {
  return (
    <div className="flex items-center gap-4">
      <Image src={LogoInformatics} alt="" className="size-12" />
      <Image src={logoHimatif} alt="" className="size-12" />
    </div>
  );
};

export default BrandLogo;
