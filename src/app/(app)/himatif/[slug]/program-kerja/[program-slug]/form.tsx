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
import { isURL, toSlug } from '@/utils/string';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Textarea } from '@/components/atoms/textarea';
import Link from 'next/link';
import { Cabinet, Division, WorkProgram } from '@/generated/prisma';
import {
  CreateUpdateWorkProgram,
  createUpdateWorkProgramSchema,
} from '../schema';
import { formatTime } from '@/utils/date';
import { createWorkProgram, updateWorkProgram } from '../actions';
import { InputSelect } from '@/components/atoms/select';
import RichTextInput from '@/components/atoms/richtext-input';
import { Switch } from '@/components/atoms/switch';

const Form = ({
  cabinet,
  data,
  divisions,
}: {
  data?: WorkProgram;
  cabinet?: Pick<Cabinet, 'id' | 'slug' | 'name' | 'logoPath'>;
  divisions?: Pick<Division, 'id' | 'name'>[];
}) => {
  const nav = useRouter();

  const form = useFormik<CreateUpdateWorkProgram>({
    initialValues: {
      divisionId: data?.divisionId ?? '',
      cabinetId: data?.cabinetId ?? cabinet?.id ?? '',
      title: data?.title ?? '',
      slug: data?.slug ?? '',
      description: data?.description ?? '',
      content: data?.content ?? '',
      startDate: formatTime(data?.startDate, 'YYYY-MM-DD'),
      endDate: formatTime(data?.endDate, 'YYYY-MM-DD'),
      picturePath: data?.picturePath ?? '',
      isPinned: data?.isPinned ?? false,
    },
    validationSchema: createUpdateWorkProgramSchema,
    onSubmit: async (val) => {
      const res = await (data?.id
        ? updateWorkProgram({ id: data.id, data: val })
        : createWorkProgram({ data: val }));

      const msg = data?.id
        ? 'mengedit program-kerja'
        : 'menambahkan program-kerja';
      if (res.success) {
        toast.success('Berhasil ' + msg);
        nav.replace(
          `/himatif/${cabinet?.slug ?? '0'}/program-kerja/${res.data?.slug ?? '0'}`
        );
      } else toast.error(res.message ?? 'Gagal ' + msg);
    },
  });

  return (
    <Container>
      {cabinet && (
        <Link
          href={'/?kabinet=' + cabinet.slug}
          className={'mb-6 flex items-center gap-3'}
        >
          <Image
            width={80}
            height={80}
            alt=""
            src={cabinet.logoPath ?? ''}
            className="size-16 object-contain"
          />
          <div>
            <small className="typo-small text-muted-foreground">
              {data?.id ? 'Edit' : 'Tambah'} ke
            </small>
            <p className="typo-large">Kabinet {cabinet.name}</p>
          </div>
        </Link>
      )}
      <Card>
        <CardHeader>
          <CardTitle>{data?.id ? 'Edit' : 'Tambah'} Program Kerja</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit} className="flex flex-col gap-6">
            <InputField
              label="Program unggulan"
              hint="Ditampilkan di halaman utama"
              error={form.errors.isPinned}
            >
              <Switch
                checked={form.values.isPinned}
                onCheckedChange={(s) => form.setFieldValue('isPinned', s)}
              />
            </InputField>

            <InputField label="Divisi" error={form.errors.divisionId}>
              <InputSelect
                list={divisions ?? []}
                valueKey={'id'}
                labelKey={'name'}
                value={form.values.divisionId}
                onValueChange={(v) => form.setFieldValue('divisionId', v)}
              />
            </InputField>

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

            <InputField
              label="Deskripsi"
              error={form.errors.description}
              required
            >
              <Textarea
                id="description"
                name="description"
                value={form.values.description}
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

            <div className="flex items-center gap-3">
              <InputField label="Mulai" error={form.errors.startDate}>
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.values.startDate}
                  onChange={form.handleChange}
                />
              </InputField>
              <InputField label="Selesai" error={form.errors.endDate}>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={form.values.endDate}
                  onChange={form.handleChange}
                />
              </InputField>
            </div>

            {form.values.picturePath &&
              isURL(form.values.picturePath, [
                'cdn.jsdelivr.net',
                'res.cloudinary.com',
              ]) && (
                <Image
                  src={form.values.picturePath}
                  className="aspect-video size-full max-w-md rounded-xl border"
                  alt=""
                  width={700}
                  height={300}
                />
              )}

            <InputField
              label=""
              error={form.errors.picturePath}
              hint="Salin tautan dari domain cdn.jsdelivr.net atau res.cloudinary.com"
            >
              <Input
                id="picturePath"
                name="picturePath"
                value={form.values.picturePath ?? ''}
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
