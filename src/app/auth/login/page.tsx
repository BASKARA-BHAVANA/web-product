'use client';

import { Button } from '@/components/atoms/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

const Page = () => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="typo-h3 mb-2 text-center">Yuk, lanjut dengan Google!</h3>
      <p className="max-w-sm text-center">
        Cuma butuh satu klik buat mulai. Daftar atau login langsung pakai akun
        Google kamu.
      </p>

      <div className="my-8">
        <Button
          size={'lg'}
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          <Image
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
            width={20}
            height={20}
            alt=""
          />
          Lanjutkan dengan Google
        </Button>
      </div>
    </div>
  );
};

export default Page;
