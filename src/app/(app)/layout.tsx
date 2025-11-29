import Header from '@/components/molecules/header';
import Footer from '@/components/molecules/footer';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <main className="min-h-screen w-full">{children}</main>
      <Footer />
    </main>
  );
}
