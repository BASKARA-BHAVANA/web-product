import { Course } from '@/generated/prisma';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../atoms/card';
import { ArrowRightIcon, ChevronRightIcon, StarIcon } from 'lucide-react';
import { Button } from '../atoms/button';
import Link from 'next/link';
import { Badge } from '../atoms/badge';
import { fromNow } from '@/utils/date';

interface CourseCardProps {
  course: Pick<Course, 'id' | 'title' | 'slug' | 'tags' | 'updatedAt'>;
}

const CourseCardDefault = ({ course }: CourseCardProps) => {
  return (
    <Card className="group">
      <CardHeader>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        <CardAction>
          <Button variant={'outline'} asChild>
            <Link href={`/materi-belajar/buka/${course.slug}`}>
              Buka{' '}
              <ArrowRightIcon className="transition-all group-hover:-rotate-45" />
            </Link>
          </Button>
        </CardAction>
        <CardDescription>
          Diperbarui {fromNow(course.updatedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col">
        <div className="mt-auto flex flex-wrap gap-3">
          {course.tags?.split(';').map((tag, i) => (
            <Badge variant={'secondary'} key={i}>
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface CourseCardSlimProps {
  course: Pick<Course, 'id' | 'title' | 'slug' | 'tags'>;
}

const CourseCardSlim = ({ course }: CourseCardSlimProps) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b pb-3">
      <div>
        <p className="typo-p mb-1 line-clamp-2">{course.title}</p>
        <div className="flex flex-wrap gap-3">
          {course.tags?.split(';').map((tag, i) => (
            <Badge variant={'secondary'} key={i}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <Button variant={'ghost'} size={'icon'} asChild>
        <Link href={`/materi-belajar/buka/${course.slug}`}>
          <ChevronRightIcon />
        </Link>
      </Button>
    </div>
  );
};

interface CourseCardCompactProps {
  course: Pick<Course, 'id' | 'title' | 'slug' | 'tags'>;
  prevSlugs: string[];
}

const CourseCardCompact = ({ course, prevSlugs }: CourseCardCompactProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        <CardDescription>
          <div className="mt-3 flex flex-wrap gap-3">
            {course.tags?.split(';').map((tag, i) => (
              <Badge variant={'secondary'} key={i}>
                {tag}
              </Badge>
            ))}
          </div>
        </CardDescription>
        <CardAction>
          <div className="flex gap-3">
            <Button asChild>
              <Link href={`/materi-belajar/buka/${course.slug}`}>Buka</Link>
            </Button>
            <Button variant={'secondary'} asChild>
              <Link
                href={`/materi-belajar/struktur/${[...prevSlugs, course.slug].join('/')}`}
              >
                <ChevronRightIcon />
              </Link>
            </Button>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
};

export { CourseCardDefault, CourseCardSlim, CourseCardCompact };
