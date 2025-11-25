'use client';

import { Session } from 'next-auth';
import React from 'react';
import { Button } from '../atoms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../atoms/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/avatar';
import { LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { getInitials } from '@/utils/string';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

const AuthButton = ({ session }: { session?: Session | null }) => {
  const _login = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const _logout = () => {
    signOut({ callbackUrl: '/' });
  };

  return session?.user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar tabIndex={0} className="cursor-pointer">
          <AvatarImage src={session.user.image ?? ''} alt="@shadcn" />
          <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={'/profil'}>
            <UserIcon /> Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={_logout} className="!text-destructive">
          <LogOutIcon className="text-destructive" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button onClick={_login}>
      <Image
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
        width={16}
        height={16}
        alt=""
      />
      Login
    </Button>
  );
};

export default AuthButton;
