import Container from '@/components/molecules/container';
import { ExceptionOverlay } from '@/components/molecules/exception';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { fromNow } from '@/utils/date';
import {
  CalendarDaysIcon,
  Edit2Icon,
  Trash2Icon,
  UserPenIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/atoms/card';
import AdminView from '@/components/molecules/admin-view';
import { deleteArticle } from '../actions';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article)
    return (
      <ExceptionOverlay title="Artikel tidak ditemukan">
        <Button asChild>
          <Link replace href={'/artikel'}>
            Pencarian
          </Link>
        </Button>
      </ExceptionOverlay>
    );

  return (
    <>
      <Container>
        <h1 className="typo-h1">{article.title}</h1>
        {article.tags && (
          <div className="mt-3 flex flex-wrap gap-3">
            {article.tags.split(',').map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
            ))}
          </div>
        )}
        <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-3">
          <UserPenIcon size={18} />
          <p className="typo-p pe-3">{article.author ?? '-'}</p>
          <CalendarDaysIcon size={18} />
          <p className="typo-p pe-3">{fromNow(article.createdAt)}</p>
        </div>
        <AdminView className="mt-3">
          <form
            action={async () => {
              'use server';
              await deleteArticle(article.id);
            }}
          >
            <Button variant={'outline'} size={'sm'}>
              <Trash2Icon />
              Hapus
            </Button>
          </form>
          <Button variant={'outline'} size={'sm'} asChild>
            <Link href={`/artikel/${slug}/edit`}>
              <Edit2Icon />
              Edit
            </Link>
          </Button>
        </AdminView>
      </Container>

      <Container className="flex flex-col gap-12 lg:flex-row">
        <div className="lg:w-2/3">
          {article.picturePath && (
            <div className="mb-6 overflow-hidden rounded-xl">
              <Image
                src={article.picturePath}
                alt=""
                width={1920}
                height={1080}
              />
            </div>
          )}

          <Card>
            <CardContent>
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: article.content ?? '' }}
              ></div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-1/3"></div>
      </Container>
    </>
  );
};

export default Page;
