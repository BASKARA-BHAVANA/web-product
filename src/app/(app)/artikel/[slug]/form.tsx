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
import { Article } from '@/generated/prisma';
import { CreateUpdateArticle, createUpdateArticleSchema } from '../schema';
import { createArticle, updateArticle } from '../actions';
import Image from 'next/image';

const Form = ({ data }: { data?: Article }) => {
  const nav = useRouter();

  const form = useFormik<CreateUpdateArticle>({
    initialValues: {
      title: data?.title ?? '',
      slug: data?.slug ?? '',
      content: data?.content ?? '',
      picturePath: data?.picturePath ?? '',
      author: data?.author ?? '',
      tags: data?.tags ?? '',
    },
    validationSchema: createUpdateArticleSchema,
    onSubmit: async (val) => {
      const res = await (data?.id
        ? updateArticle({ id: data.id, data: val })
        : createArticle({ data: val }));

      const msg = data?.id ? 'mengedit artikel' : 'menambahkan artikel';
      if (res.success) {
        toast.success('Berhasil ' + msg);
        nav.replace('/artikel/' + (res.data?.slug ?? ''));
      } else toast.error(res.message ?? 'Gagal ' + msg);
    },
  });

  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>{data?.id ? 'Edit' : 'Tambah'} Artikel</CardTitle>
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

            {form.values.picturePath &&
              isURL(form.values.picturePath, 'cdn.jsdelivr.net') && (
                <div className="bg-secondary aspect-video max-w-md overflow-hidden rounded-xl">
                  <Image
                    src={form.values.picturePath}
                    className="size-full"
                    alt=""
                    width={1080}
                    height={720}
                  />
                </div>
              )}

            <InputField
              label="URL gambar"
              error={form.errors.picturePath}
              hint="Salin tautan dari domain cdn.jsdelivr.net"
              required
            >
              <Input
                id="picturePath"
                name="picturePath"
                value={form.values.picturePath ?? ''}
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

            <InputField label="Author" error={form.errors.author} required>
              <Input
                id="author"
                name="author"
                value={form.values.author ?? ''}
                onChange={form.handleChange}
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
