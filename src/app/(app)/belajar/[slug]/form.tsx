'use client';

import Container from '@/components/molecules/container';
import { Button } from '@/components/atoms/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import InputField from '@/components/atoms/input-field';
import RichTextInput from '@/components/atoms/richtext-input';
import { isURL, toSlug } from '@/utils/string';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CornerLeftDownIcon } from 'lucide-react';
import Link from 'next/link';
import { Course } from '@/generated/prisma';
import { CreateUpdateCourse, createUpdateCourseSchema } from '../schema';
import { createCourse, updateCourse } from '../actions';

const Form = ({
  data,
  parentData,
}: {
  data?: Course;
  parentData?: Pick<Course, 'id' | 'title'>;
}) => {
  const nav = useRouter();

  const form = useFormik<CreateUpdateCourse>({
    initialValues: {
      title: data?.title ?? '',
      slug: data?.slug ?? '',
      filePath: data?.filePath ?? '',
      content: data?.content ?? '',
      tags: data?.tags ?? '',
    },
    validationSchema: createUpdateCourseSchema,
    onSubmit: async (val) => {
      const res = await (data?.id
        ? updateCourse({ id: data.id, data: val })
        : createCourse({
            data: { ...val, courseId: parentData?.id },
          }));

      const msg = data?.id ? 'mengedit materi' : 'menambahkan materi';
      if (res.success) {
        toast.success('Berhasil ' + msg);
        nav.replace('/belajar/' + (res.data?.slug ?? '0'));
      } else toast.error(res.message ?? 'Gagal ' + msg);
    },
  });

  return (
    <Container>
      {parentData && (
        <div className="mb-3 flex items-center gap-2">
          <CornerLeftDownIcon
            size={14}
            className="text-muted-foreground relative top-1"
          />
          <small className="typo-small text-muted-foreground">
            Submateri dari
          </small>
          <Link href={`/admin/belajar/${parentData.id}`}>
            <h4 className="typo-h4">{parentData.title}</h4>
          </Link>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>{data?.id ? 'Edit' : 'Tambah'} Materi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit} className="flex flex-col gap-6">
            <InputField label="Judul" error={form.errors.title} required>
              <Input
                id="title"
                name="title"
                value={form.values.title}
                onChange={(e) => {
                  form.handleChange(e);
                  form.setFieldValue('slug', toSlug(e.target.value));
                }}
              />
            </InputField>

            <InputField label="Slug" error={form.errors.slug} required>
              <Input
                id="slug"
                name="slug"
                value={form.values.slug}
                onChange={form.handleChange}
              />
            </InputField>

            {form.values.filePath && isURL(form.values.filePath) && (
              <div className="bg-secondary aspect-video max-w-md overflow-hidden rounded-xl">
                <iframe src={form.values.filePath} className="size-full" />
              </div>
            )}

            <InputField
              label="URL drive"
              error={form.errors.filePath}
              hint="Salin tautan /preview fail dari Google Drive. Pastikan fail memiliki akses publik"
              required
            >
              <Input
                id="filePath"
                name="filePath"
                value={form.values.filePath ?? ''}
                onChange={form.handleChange}
              />
            </InputField>

            <InputField label="Konten" error={form.errors.content} required>
              <RichTextInput
                value={form.values.content ?? ''}
                error={form.errors.content}
                onChange={(v) => form.setFieldValue('content', v)}
              />
            </InputField>

            <InputField
              label="Tags"
              error={form.errors.tags}
              hint="Pisahkan dengan koma ',' tanpa spasi"
              required
            >
              <Input
                id="tags"
                name="tags"
                value={form.values.tags ?? ''}
                onChange={form.handleChange}
              />
            </InputField>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={form.isSubmitting}>
                {form.isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Form;
