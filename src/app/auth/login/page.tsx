'use client';

import { Button } from '@/components/atoms/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function Page() {
  const _login = async () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Login ke Akun Kamu</CardTitle>
        <CardDescription>Login dengan akun google Kamu</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button size={'lg'} className="w-full" onClick={_login}>
          <Image
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
            width={20}
            height={20}
            alt=""
          />
          Lanjutkan dengan Google
        </Button>
      </CardFooter>
    </Card>
  );
}
