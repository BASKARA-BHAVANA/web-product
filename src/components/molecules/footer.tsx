import BrandLogo from '@/components/molecules/brand-logo';
import Container from '@/components/molecules/container';
import Link from 'next/link';
import { Button } from '../atoms/button';

const Footer = async () => {
  return (
    <div className="w-screen p-6">
      <Container className="bg-primary border-primary-foreground flex flex-col items-center rounded-xl border py-12">
        <div className="mb-2">
          <BrandLogo />
        </div>
        <p className="typo-p text-primary-foreground mt-2 mb-8 max-w-sm text-center">
          Himpunan Mahasiswa Teknik Informatika UIN Sunan Gunung Djati Bandung
        </p>
        <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
          <Button variant={'ghost'} className="text-primary-foreground" asChild>
            <Link href={'/kebijakan-privasi'}>Kebijakan privasi</Link>
          </Button>
          <Button variant={'ghost'} className="text-primary-foreground" asChild>
            <Link href={'/developer'}>Developer</Link>
          </Button>
        </div>
        <small className="typo-small text-primary-foreground">
          @ 2025 Nalar dan Intelektual | All Rights Reserved
        </small>
      </Container>
    </div>
  );
};

export default Footer;
