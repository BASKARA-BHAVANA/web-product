import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import Container from '@/components/molecules/container';
import { EyeIcon, FolderTreeIcon, LibraryIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import HeroTitle from './_components/hero-title';

const Page = () => {
  return (
    <Container className="max-w-3xl py-12">
      <HeroTitle />

      <div className="mb-12 flex flex-wrap items-center justify-evenly gap-12">
        <div className="relative flex items-end gap-3">
          <LibraryIcon
            size={120}
            className="text-primary absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-50"
          />
          <h1 className="typo-h1 !text-7xl">{0}</h1>
          <p className="typo-lead text-muted-foreground pb-3">Materi</p>
        </div>
        <div className="relative flex items-end gap-3">
          <EyeIcon
            size={120}
            className="text-primary absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-50"
          />
          <h1 className="typo-h1 !text-7xl">{0}</h1>
          <p className="typo-lead text-muted-foreground pb-3">Kunjungan</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="group grow">
          <Link href={'materi-belajar/cari'}>
            <Card className="group-hover:bg-primary group-hover:border-primary-foreground transition-all group-hover:border-2">
              <CardHeader>
                <SearchIcon
                  size={60}
                  className="group-hover:text-primary-foreground text-muted-foreground mb-12"
                />
                <CardTitle className="group-hover:text-primary-foreground">
                  Pencarian
                </CardTitle>
                <CardDescription className="group-hover:text-primary-foreground">
                  Temukan lebih cepat materi yang ingin kamu cari
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
        <div className="group grow">
          <Link href={'materi-belajar/struktur'}>
            <Card className="group-hover:bg-primary group-hover:border-primary-foreground transition-all group-hover:border-2">
              <CardHeader>
                <FolderTreeIcon
                  size={60}
                  className="group-hover:text-primary-foreground text-muted-foreground mb-12"
                />
                <CardTitle className="group-hover:text-primary-foreground">
                  Struktur
                </CardTitle>
                <CardDescription className="group-hover:text-primary-foreground">
                  Jelajahi dan pelajari seluruh materi lebih terarah
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Page;
