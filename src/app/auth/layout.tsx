import BrandLogo from '@/components/molecules/brand-logo';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden p-8">
      {/* container  */}
      <div className="relative z-10 m-auto">{children}</div>

      {/* brand  */}
      <div className="absolute top-4 right-4">
        <BrandLogo />
      </div>

      {/* insets  */}
      <div className="border-primary-foreground bg-primary absolute -top-1/2 -left-3/4 h-screen w-screen rotate-45 border-[64px]"></div>
      <div className="border-primary-foreground bg-primary absolute top-1/2 left-3/4 h-screen w-screen rotate-45 border-[64px]"></div>
    </div>
  );
}
