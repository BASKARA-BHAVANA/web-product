import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../atoms/card';
import { Badge } from '../atoms/badge';
import Link from 'next/link';
import { Course } from '@/generated/prisma';
import { ComponentProps } from 'react';
import { ListItem } from '../atoms/list';
import { Button } from '../atoms/button';
import { ArrowUpRightIcon } from 'lucide-react';

const CourseCard = ({
  data,
  href,
}: {
  data: Pick<Course, 'id' | 'title' | 'tags' | 'slug'> & {
    _count?: {
      courses: number;
    };
  };
  href?: string;
}) => {
  return (
    <Card className="hover:shadow-primary flex aspect-square flex-col overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
      <CardHeader>
        <CardTitle>
          <Link
            href={href ?? `/belajar/${data.slug}`}
            className="hover:underline"
          >
            {data.title}
          </Link>
        </CardTitle>
        <CardDescription>{data._count?.courses ?? 0} submateri</CardDescription>
      </CardHeader>
      <CardContent className="flex grow">
        <div className="mt-auto flex flex-wrap items-end gap-3">
          {data.tags
            ?.split(',')
            .filter(Boolean)
            .map((tag, i) => <Badge key={i}>{tag}</Badge>)}
        </div>
      </CardContent>
    </Card>
  );
};

const CourseListItem = ({
  data,
  slotRight,
  ...props
}: {
  data: Pick<Course, 'title' | 'tags' | 'slug'>;
} & Partial<ComponentProps<typeof ListItem>>) => {
  return (
    <ListItem
      title={data.title}
      subtitle={data.tags?.split(',').filter(Boolean).join(', ') ?? ''}
      slotRight={
        <>
          <Button variant={'outline'} size={'icon'}>
            <Link href={`/belajar/${data.slug}`}>
              <ArrowUpRightIcon />
            </Link>
          </Button>
          {slotRight}
        </>
      }
      {...props}
    />
  );
};

export { CourseCard, CourseListItem };
