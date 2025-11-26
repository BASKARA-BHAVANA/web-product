import Container from '@/components/molecules/container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { FolderTreeIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import Headline from '@/components/molecules/headline';

const Page = () => {
  return (
    <Container className="max-w-3xl py-12">
      <Headline
        className="mb-12 items-center"
        largeTexts={['Bridging Informatics']}
        headText="Eksplorasi Dunia Informatika"
      />
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="group grow">
          <Link href={'/belajar/cari'}>
            <Card className="group-hover:shadow-primary transition-all group-hover:scale-105 group-hover:shadow-lg">
              <CardHeader>
                <SearchIcon
                  size={60}
                  className="text-muted-foreground group-hover:text-primary-foreground mb-12"
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
          <Link href={'/belajar/struktur/0'}>
            <Card className="group-hover:shadow-primary transition-all group-hover:scale-105 group-hover:shadow-lg">
              <CardHeader>
                <FolderTreeIcon
                  size={60}
                  className="text-muted-foreground group-hover:text-primary-foreground mb-12"
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
