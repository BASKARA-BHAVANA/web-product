'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { startTransition, use, useActionState, useEffect } from 'react';
import { CreateCourse, createCourseSchema } from '../model';
import {
  createCourse,
  getCoursesTitle,
  getCoursesTitleProps,
} from '../actions';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import { isURL } from '@/utils/string';
import RichTextEditor from '@/components/molecules/richtext-editor';
import { Button } from '@/components/atoms/button';
import { CornerDownRightIcon } from 'lucide-react';
import { Badge } from '@/components/atoms/badge';

const Page = ({
  searchParams,
}: {
  searchParams: Promise<{ parent?: string }>;
}) => {
  const { parent } = use(searchParams);
  const router = useRouter();

  const [parentData, getParentData] = useActionState(
    (_: unknown, props: getCoursesTitleProps) => getCoursesTitle(props),
    { message: '' }
  );

  useEffect(() => {
    if (parent)
      startTransition(() => {
        getParentData({ slugs: [parent] });
      });
  }, [parent]);

  const form = useFormik<CreateCourse>({
    initialValues: {
      title: '',
      file: '',
      content: '',
      tags: [],
      parentId: undefined,
    },
    validationSchema: createCourseSchema,
    onSubmit: async (val, { setSubmitting }) => {
      setSubmitting(true);
      const { status, message } = await createCourse(val);
      if (status) toast[status](message);
      if (status == 'success')
        router.replace('/admin/belajar/materi-belajar/0/');
      setSubmitting(false);
    },
  });

  useEffect(() => {
    form.setFieldValue('parentId', parentData.data?.items.at(0)?.id);
  }, [parentData]);

  return (
    <>
      <div className="mb-4">
        <h1 className="typo-h1 grow">Tambah Materi</h1>

        {parentData.data?.items.length != 0 && form.values.parentId && (
          <div className="me-2 mt-2 flex items-center gap-2">
            <CornerDownRightIcon className="text-muted-foreground" />
            <p className="typo-p text-muted-foreground">ke materi</p>
            <Badge variant={'secondary'} className="cursor-pointer">
              {parentData.data?.items.at(0)?.title}
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
                isURL(form.values.file, 'drive.google.com')
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

export default Page;
