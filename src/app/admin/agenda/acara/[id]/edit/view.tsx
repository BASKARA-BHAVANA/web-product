'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { useFormik } from 'formik';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getEvent, updateEvent } from '../../actions';
import {
  EventImageFileTypes,
  UpdateEvent,
  updateEventSchema,
} from '../../model';
import { formatTime } from '@/utils/date';
import RichTextEditor from '@/components/molecules/richtext-editor';
import { Switch } from '@/components/atoms/switch';

const View = ({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getEvent>>['data']>;
}) => {
  const { image, ...rest } = data;
  const router = useRouter();

  const [previews, setPreviews] = useState<Record<string, string>>({
    image: image ?? '',
  });
  const form = useFormik<UpdateEvent>({
    initialValues: {
      title: rest.title,
      image: undefined,
      location: rest.location ?? '',
      longlat: rest.longlat ?? '',
      content: rest.content ?? '',
      startDate: formatTime(rest.startDate ?? '', 'YYYY-MM-DD'),
      endDate: formatTime(rest.endDate ?? '', 'YYYY-MM-DD'),
      isActive: rest.isActive,
    },
    validationSchema: updateEventSchema,
    onSubmit: async (val, { setSubmitting }) => {
      setSubmitting(true);
      const { status, message } = await updateEvent(data.id, val);
      if (status) toast[status](message);
      if (status == 'success') router.replace('/admin/agenda/acara');
      setSubmitting(false);
    },
  });

  return (
    <>
      <div className="mb-4">
        <h1 className="typo-h1 grow">Tambah Kabinet</h1>
      </div>

      <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi umum</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-4">
            <Input
              label="Judul"
              name="title"
              value={form.values.title}
              error={form.errors.title}
              onChange={form.handleChange}
            />
            <div className="flex items-start gap-3">
              <Input
                type="date"
                label="Mulai"
                name="startDate"
                value={form.values.startDate}
                error={form.errors.startDate}
                onChange={form.handleChange}
              />
              <Input
                type="date"
                label="Selesai"
                name="endDate"
                value={form.values.endDate}
                error={form.errors.endDate}
                onChange={form.handleChange}
              />
            </div>
            <Switch
              label="Aktif"
              name="isActive"
              checked={form.values.isActive}
              error={form.errors.isActive}
              onCheckedChange={(v) => form.setFieldValue('isActive', v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi tambahan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-4">
            <Input
              label="Lokasi"
              name="location"
              value={form.values.location}
              error={form.errors.location}
              onChange={form.handleChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konten</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-4">
            <Input
              type="file"
              label="Gambar"
              accept={EventImageFileTypes.join(',')}
              filePreview={previews['image']}
              filePreviewClassName="aspect-video max-w-60"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) form.setFieldValue('image', file);
                setPreviews((obj) => ({
                  ...obj,
                  ['image']: file ? URL.createObjectURL(file) : '',
                }));
              }}
              error={form.errors.image}
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
