import BrandLogo from '@/components/molecules/brand-logo';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden p-8">
      {/* container  */}
      <div className="bg-card border-card-foreground relative z-10 m-auto w-full max-w-xl overflow-y-auto rounded-md border p-6">
        {children}
      </div>

      {/* brand  */}
      <div className="absolute top-4 right-4">
        <BrandLogo />
      </div>

      {/* insets  */}
      <div className="bg-primary border-primary-foreground absolute -top-1/2 -left-2/3 h-screen w-screen rotate-45 border-[64px]"></div>
      <div className="bg-primary border-primary-foreground absolute top-1/2 left-2/3 h-screen w-screen rotate-45 border-[64px]"></div>
    </div>
  );
}
