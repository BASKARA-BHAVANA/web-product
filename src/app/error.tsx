'use client';

import { UndrawServerDown } from '@/assets/images';
import { Button } from '@/components/atoms/button';
import BrandLogo from '@/components/molecules/brand-logo';
import Container from '@/components/molecules/container';
import { ExceptionOverlay } from '@/components/molecules/exception';
import { buildError } from '@/lib/actions/error';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter(),
    errorBuilt = buildError(error);

  return (
    <Container>
      <BrandLogo />

      <ExceptionOverlay
        img={UndrawServerDown}
        className="max-w-lg"
        title="Terjadi Kesalahan Tak Terduga"
        subtitle={errorBuilt.message}
      >
        <Button onClick={() => reset()}>Coba lagi</Button>

        <Button variant={'outline'} onClick={() => router.push('/')}>
          Halaman utama
        </Button>
      </ExceptionOverlay>

      <pre className="bg-background typo-small mx-auto mt-6 max-w-lg overflow-x-auto rounded-md border p-3 text-left">
        {process.env.NODE_ENV === 'development' ? String(error?.stack) : null}
      </pre>
    </Container>
  );
}
