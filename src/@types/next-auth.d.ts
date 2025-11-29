import { Role } from '@/generated/prisma';
import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role?: string;
  }
}
