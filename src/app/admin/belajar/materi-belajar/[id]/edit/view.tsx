'use client';

import React from 'react';
import { getCourse, getCourseParents, updateCourse } from '../../actions';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { UpdateCourse, updateCourseSchema } from '../../model';
import { toast } from 'sonner';
import { CornerDownRightIcon } from 'lucide-react';
import { Badge } from '@/components/atoms/badge';
import { Card, CardContent } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import { isURL } from '@/utils/string';
import RichTextEditor from '@/components/molecules/richtext-editor';
import { Button } from '@/components/atoms/button';

const View = ({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getCourse>>['data']>;
}) => {
  const router = useRouter();

  const form = useFormik<UpdateCourse>({
    initialValues: {
      title: data.title,
      file: data.file,
      content: data.content ?? '',
      tags: data.tags?.split(';') ?? [],
      parentId: data.parentId ?? undefined,
    },
    validationSchema: updateCourseSchema,
    onSubmit: async (val, { setSubmitting }) => {
      setSubmitting(true);
      const { status, message } = await updateCourse(data.id, val);
      if (status) toast[status](message);
      if (status == 'success') {
        const parents = val.parentId
          ? ((await getCourseParents({ id: val.parentId })).data?.items ?? [])
          : [];
        router.replace(
          `/admin/belajar/materi-belajar/0/${parents.map((p) => p.slug).join('/')}`
        );
      }
      setSubmitting(false);
    },
  });

  return (
    <>
      <div className="mb-4">
        <h1 className="typo-h1 grow">Edit Materi</h1>

        {data.parent && (
          <div className="me-2 mt-2 flex items-center gap-2">
            <CornerDownRightIcon className="text-muted-foreground" />
            <p className="typo-p text-muted-foreground">di materi</p>
            <Badge variant={'secondary'} className="cursor-pointer">
              {data?.parent?.title}
            </Badge>
          </div>
        )}
      </div>

      <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-6 pt-4">
            <Input
              label="Judul"
              name="title"
              value={form.values.title}
              error={form.errors.title}
              onChange={form.handleChange}
            />
            <Input
              label="Tags"
              name="tags"
              hint="Pisahkan dengan simbol koma (,)"
              value={form.values.tags?.join(',')}
              error={form.errors.tags}
              onChange={(e) =>
                form.setFieldValue('tags', e.target.value.split(','))
              }
            />
            <Input
              usePreview
              label="Tautan fail materi"
              name="file"
              hint="Salin tautan /preview fail dari Google Drive. Pastikan fail memiliki akses publik"
              filePreview={
                isURL(form.values.file ?? '', 'drive.google.com')
                  ? form.values.file
                  : ''
              }
              filePreviewClassName="aspect-video max-w-80"
              value={form.values.file}
              error={form.errors.file}
              onChange={form.handleChange}
            />
            <RichTextEditor
              value={form.values.content ?? ''}
              error={form.errors.content}
              onChange={(v) => form.setFieldValue('content', v)}
            />
          </CardContent>
        </Card>

        <div>
          <Button type="submit" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default View;
