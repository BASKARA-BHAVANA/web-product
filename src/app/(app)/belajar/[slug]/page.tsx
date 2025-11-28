import Container from '@/components/molecules/container';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { List } from '@/components/atoms/list';
import { CornerLeftDownIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { ExceptionOverlay } from '@/components/molecules/exception';
import { prisma } from '@/lib/prisma';
import { CourseListItem } from '@/components/organisms/course-widgets';
import AdminView from '@/components/molecules/admin-view';
import { deleteCourse } from '../actions';
import { isScholarFilter, ScholarsFilter } from '@/lib/actions/scholar';
import InputField from '@/components/atoms/input-field';
import { getOption } from '@/utils/option';
import { Faculties } from '@/data/faculties';
import { Majors } from '@/data/majors';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      course: { select: { slug: true, title: true } },
      courses: {
        select: { slug: true, title: true, tags: true },
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!course)
    return (
      <ExceptionOverlay
        title="Materi Tidak Ada"
        subtitle="Lanjut ke pencarian aja yuk!"
      >
        <Button asChild>
          <Link replace href={'/belajar/cari'}>
            Pencarian
          </Link>
        </Button>
      </ExceptionOverlay>
    );

  return (
    <>
      <Container>
        {course.course && (
          <div className="mb-1 flex items-center gap-2">
            <CornerLeftDownIcon
              size={14}
              className="text-muted-foreground relative top-1"
            />
            <small className="typo-small text-muted-foreground">
              Submateri dari
            </small>
            <Link href={`/belajar/${course.course.slug}`}>
              <Badge variant={'secondary'} className="cursor-pointer">
                {course.course.title}
              </Badge>
            </Link>
          </div>
        )}

        <h1 className="typo-h1">{course.title}</h1>
        {course.tags && (
          <div className="mt-3 flex flex-wrap gap-3">
            {course.tags.split(',').map((tag, i) => (
              <Badge key={i}>{tag}</Badge>
            ))}
          </div>
        )}
        <AdminView className="mt-3">
          <form
            action={async () => {
              'use server';
              await deleteCourse(course.id);
            }}
          >
            <Button variant={'outline'} size={'sm'}>
              <Trash2Icon />
              Hapus
            </Button>
          </form>
          <Button variant={'outline'} size={'sm'} asChild>
            <Link href={`/belajar/${course.slug}/edit`}>
              <Edit2Icon />
              Edit
            </Link>
          </Button>
        </AdminView>
      </Container>

      <Container className="flex flex-col gap-12 lg:flex-row">
        <div className="lg:w-2/3">
          <div className="mb-6 aspect-video overflow-hidden rounded-lg">
            <iframe src={course.filePath} className="size-full" />
          </div>

          <Card>
            <CardContent>
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: course.content ?? '' }}
              ></div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-1/3">
          {isScholarFilter({ rules: course.scholarRules }) && (
            <Card className="mb-6">
              <CardHeader>
                <p className="typo-large bg-primary border-primary-foreground w-fit rounded-md border px-2">
                  Ekslusif
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 pt-6">
                <InputField label="Angkatan">
                  <p className="typo-p">
                    {(course.scholarRules as ScholarsFilter)?.cohorts?.join(
                      ', '
                    )}
                  </p>
                </InputField>
                <InputField label="Sarjana">
                  <p className="typo-p">
                    {(course.scholarRules as ScholarsFilter)?.degrees?.join(
                      ', '
                    )}
                  </p>
                </InputField>
                <InputField label="Fakultas">
                  <p className="typo-p">
                    {(course.scholarRules as ScholarsFilter)?.faculties
                      ?.map((f) => getOption(Faculties, f)?.label)
                      .join(', ')}
                  </p>
                </InputField>
                <InputField label="Jurusan">
                  <p className="typo-p">
                    {(course.scholarRules as ScholarsFilter)?.majors
                      ?.map((f) => getOption(Majors, f)?.label)
                      .join(', ')}
                  </p>
                </InputField>
              </CardContent>
            </Card>
          )}
          <Card className="mb-3">
            <CardHeader>
              <CardTitle>Submateri</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <List>
                {course.courses.length ? (
                  course.courses.map((data, i) => (
                    <CourseListItem key={i} data={data} />
                  ))
                ) : (
                  <ExceptionOverlay title="Tidak ada materi lainnya" />
                )}
              </List>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default Page;
