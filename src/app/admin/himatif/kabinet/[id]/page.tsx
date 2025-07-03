'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { useParams } from 'next/navigation';
import { useFormik } from 'formik';
import { CreateUpdateCabinet } from '../actions';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { Switch } from '@/components/atoms/switch';
import { Button } from '@/components/atoms/button';
import { InputSelect } from '@/components/atoms/select';
import { useState } from 'react';
import * as y from 'yup';

const ContactKeys = [
  {
    value: 'address',
    label: 'Alamat',
  },
  {
    value: 'email',
    label: 'Email',
  },
  {
    value: 'whatsapp',
    label: 'Whatsapp',
  },
  {
    value: 'instagram',
    label: 'Instagram',
  },
  {
    value: 'tiktok',
    label: 'Tiktok',
  },
  {
    value: 'youtube',
    label: 'Youtube',
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
  },
];

export const schema: y.ObjectSchema<CreateUpdateCabinet> = y.object({
  name: y.string().required('Wajib diisi'),
  tagline: y.string().required('Wajib diisi'),
  logo: y
    .mixed<File>()
    .required('Wajib diisi')
    .test(
      'fileType',
      'Jenis fail tidak valid. Hanya .png yang diizinkan.',
      (value) => (value ? ['image/png'].includes((value as File).type) : true)
    )
    .test(
      'fileSize',
      'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
      (value) => (value ? (value as File).size <= 3 * 1024 * 1024 : true)
    ),
  periode: y.string().required('Wajib diisi'),
  primaryColor: y.string().optional(),
  onPrimaryColor: y.string().optional(),
  primaryImage: y
    .mixed<File>()
    .required('Wajib diisi')
    .test(
      'fileType',
      'Jenis fail tidak valid. Hanya .png .jpg .jpeg yang diizinkan.',
      (value) =>
        value
          ? ['image/png', 'image/jpeg', 'image/jpg'].includes(
              (value as File).type
            )
          : true
    )
    .test(
      'fileSize',
      'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
      (value) => (value ? (value as File).size <= 3 * 1024 * 1024 : true)
    ),
  secondaryImage: y
    .mixed<File>()
    .required('Wajib diisi')
    .test(
      'fileType',
      'Jenis fail tidak valid. Hanya .png .jpg .jpeg yang diizinkan.',
      (value) =>
        value
          ? ['image/png', 'image/jpeg', 'image/jpg'].includes(
              (value as File).type
            )
          : true
    )
    .test(
      'fileSize',
      'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
      (value) => (value ? (value as File).size <= 3 * 1024 * 1024 : true)
    ),
  description: y.string().required('Wajib diisi'),
  vision: y.string().required('Wajib diisi'),
  mission: y.string().required('Wajib diisi'),
  isActive: y.boolean().optional(),
  contacts: y
    .array()
    .of(
      y.object({
        name: y.string().optional(),
        key: y.string().required('Wajib diisi'),
        value: y.string().required('Wajib diisi'),
      })
    )
    .optional(),
});

const Page = () => {
  const params = useParams();
  const isAdd = params.id == 'baru';

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const form = useFormik<CreateUpdateCabinet>({
    initialValues: {},
    validationSchema: schema,
    onSubmit: () => {},
  });

  return (
    <>
      <div className="mb-4">
        <h1 className="typo-h1 grow">{isAdd ? 'Tambah' : 'Edit'} Kabinet</h1>
      </div>

      <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi umum</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-4">
            <Input
              label="Nama"
              name="name"
              value={form.values.name}
              error={form.errors.name}
              onChange={form.handleChange}
            />
            <Input
              label="Tagline"
              name="tagline"
              value={form.values.tagline}
              error={form.errors.tagline}
              onChange={form.handleChange}
            />
            <Input
              label="Periode"
              placeholder="contoh: 2025/2026"
              name="periode"
              value={form.values.periode}
              error={form.errors.periode}
              onChange={form.handleChange}
            />
            <Textarea
              label="Deskripsi"
              name="description"
              value={form.values.description}
              error={form.errors.description}
              onChange={form.handleChange}
            />
            <Switch
              label="Aktif"
              name="isActive"
              checked={form.values.isActive}
              error={form.errors.isActive}
              onChange={form.handleChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visual</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-4">
            <Input
              type="file"
              label="Logo"
              accept="image/png"
              filePreview={previews['logo']}
              filePreviewClassName="aspect-square max-w-40"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) form.setFieldValue('logo', file);
                setPreviews((obj) => ({
                  ...obj,
                  ['logo']: file ? URL.createObjectURL(file) : '',
                }));
              }}
              error={form.errors.logo}
            />
            <Input
              type="file"
              label="Gambar 1"
              accept="image/*"
              filePreview={previews['primaryImage']}
              filePreviewClassName="aspect-video max-w-64"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) form.setFieldValue('primaryImage', file);
                setPreviews((obj) => ({
                  ...obj,
                  ['primaryImage']: file ? URL.createObjectURL(file) : '',
                }));
              }}
              error={form.errors.primaryImage}
            />
            <Input
              type="file"
              label="Gambar 2"
              accept="image/*"
              filePreview={previews['secondaryImage']}
              filePreviewClassName="aspect-video max-w-64"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) form.setFieldValue('secondaryImage', file);
                setPreviews((obj) => ({
                  ...obj,
                  ['secondaryImage']: file ? URL.createObjectURL(file) : '',
                }));
              }}
              error={form.errors.secondaryImage}
            />
            <div className="self-start">
              <Input
                type="color"
                label="Background"
                name="primaryColor"
                value={form.values.primaryColor}
                error={form.errors.primaryColor}
                onChange={form.handleChange}
              />
            </div>
            <div className="self-start">
              <Input
                type="color"
                label="Foreground"
                name="onPrimaryColor"
                value={form.values.onPrimaryColor}
                error={form.errors.onPrimaryColor}
                onChange={form.handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visi dan Misi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-4">
            <Textarea
              label="Visi"
              name="vision"
              value={form.values.vision}
              error={form.errors.vision}
              onChange={form.handleChange}
            />
            <Textarea
              label="Misi"
              hint="Setiap baris akan dianggap sebagai poin dan ditampilkan dalam bentuk daftar."
              name="mission"
              value={form.values.mission}
              error={form.errors.mission}
              onChange={form.handleChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontak</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-4">
            {form.values.contacts?.map((con, i) => (
              <div
                key={i}
                className="flex flex-col gap-6 rounded-md border p-6"
              >
                <InputSelect
                  label="Saluran"
                  list={ContactKeys}
                  valueKey={'value'}
                  labelKey={'label'}
                  value={con.key}
                  error={(form.errors.contacts?.[i] as any)?.key}
                  onValueChange={(v) =>
                    form.setFieldValue(`contacts[${i}].key`, v)
                  }
                />
                <Input
                  label="Kontak"
                  placeholder="cont: 08123456789"
                  name={`contacts[${i}].value`}
                  value={con.value}
                  error={(form.errors.contacts?.[i] as any)?.value}
                  onChange={form.handleChange}
                />
                <Input
                  label="Nama / username"
                  placeholder="cont: Diaz"
                  name={`contacts[${i}].name`}
                  value={con.name}
                  error={(form.errors.contacts?.[i] as any)?.name}
                  onChange={form.handleChange}
                />
                <div>
                  <Button
                    variant={'secondary'}
                    size={'sm'}
                    type="button"
                    onClick={() =>
                      form.setFieldValue('contacts', [
                        ...(form.values.contacts ?? []).filter(
                          (_, j) => j != i
                        ),
                      ])
                    }
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}

            <div>
              <Button
                type="button"
                variant={'secondary'}
                size={'sm'}
                onClick={() =>
                  form.setFieldValue('contacts', [
                    ...(form.values.contacts ?? []),
                    {},
                  ])
                }
              >
                Tambah
              </Button>
            </div>
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
