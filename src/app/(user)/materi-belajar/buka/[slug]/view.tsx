import React from 'react';
import { detailCourse, exploreCourses } from '../../actions';
import Container from '@/components/molecules/container';
import { Badge } from '@/components/atoms/badge';
import { formatTime } from '@/utils/date';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { CornerLeftDownIcon } from 'lucide-react';
import Link from 'next/link';
import { CourseCardSlim } from '@/components/molecules/course-cards';
import { Button } from '@/components/atoms/button';

const View = ({
  data,
  relatedData,
}: {
  data: NonNullable<Awaited<ReturnType<typeof detailCourse>>['data']>;
  relatedData?: NonNullable<
    Awaited<ReturnType<typeof exploreCourses>>['data']
  > | null;
}) => {
  const { item } = data;

  return (
    <Container className="flex flex-col gap-12 lg:flex-row">
      <div className="lg:w-2/3">
        {item.parent && (
          <div className="me-2 mt-2 flex items-center gap-2">
            <CornerLeftDownIcon size={18} className="text-muted-foreground" />
            <p className="typo-p text-muted-foreground">Turunan dari materi</p>
            <Badge variant={'secondary'} asChild className="cursor-pointer">
              <Link href={`/materi-belajar/buka/${item.parent.slug}`}>
                {item?.parent?.title}
              </Link>
            </Badge>
          </div>
        )}

        <div className="mb-3">
          <h1 className="typo-h1 grow">{item.title}</h1>
        </div>

        <div className="mb-12 flex flex-wrap gap-3">
          {item.tags?.split(';').map((tag, i) => (
            <Badge variant={'secondary'} key={i}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mb-16 aspect-video rounded-lg">
          <iframe src={item.file} className="size-full" />
        </div>

        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: item.content ?? '' }}
        ></div>
      </div>
      <div className="lg:w-1/3">
        <Card className="mb-3">
          <CardHeader>
            <CardTitle>Informasi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-between">
              <p className="typo-p">Dibuat</p>
              <p className="typo-p">
                {formatTime(item.createdAt, 'DD MMM YYYY HH:mm')}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="typo-p">Diperbarui</p>
              <p className="typo-p">
                {formatTime(item.updatedAt, 'DD MMM YYYY HH:mm')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-3">
          <CardHeader>
            <CardTitle>Materi terkait</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {relatedData?.items.map((item, i) => (
              <CourseCardSlim key={i} course={item} />
            ))}
            {(relatedData?.count ?? 0) - (relatedData?.limit ?? 0) > 0 && (
              <Button variant={'secondary'}>
                {(relatedData?.count ?? 0) - (relatedData?.limit ?? 0)} Lihat
                lainnya
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default View;
