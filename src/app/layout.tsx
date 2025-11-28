import type { Metadata } from 'next';
import { Fira_Code, Montserrat } from 'next/font/google';
// @ts-expect-error ignore
import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import SessionProvider from '../components/molecules/providers/session-provider';
import { Toaster } from '@/components/atoms/sonner';
import { ScrollToTop } from '@/components/molecules/scrolls';

const sans = Montserrat({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const mono = Fira_Code({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Himatif - UIN Sunan Gunung Djati',
  icons: {
    icon: 'app/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${mono.variable} overflow-x-hidden antialiased`}
      >
        <SessionProvider session={session}>
          <ScrollToTop />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
