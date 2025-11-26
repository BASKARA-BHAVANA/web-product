import Image from 'next/image';
import { SpinningText } from '@/components/atoms/magicui/spinning-text';
import { LogoInformatics } from '@/assets/images';

const LoadingOverlay = () => {
  return (
    <div className="bg-background z-50 flex min-h-screen w-screen p-12 pb-48">
      <div className="text-primary-foreground relative m-auto size-56 rounded-full">
        <Image
          src={LogoInformatics}
          width={100}
          height={100}
          alt=""
          className="absolute top-1/2 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2"
        />
        <SpinningText className="relative top-28 text-2xl font-extrabold">
          INFORMATIKA • SAKTI •
        </SpinningText>
      </div>
    </div>
  );
};

export { LoadingOverlay };
