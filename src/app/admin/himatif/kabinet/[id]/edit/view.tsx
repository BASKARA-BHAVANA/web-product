'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { useFormik } from 'formik';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { Switch } from '@/components/atoms/switch';
import { Button } from '@/components/atoms/button';
import { InputSelect } from '@/components/atoms/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getCabinet, updateCabinet } from '../../actions';
import {
  CabinetContacts,
  CreateUpdateCabinet,
  updateCabinetSchema,
} from '../../model';
import { getUploaded } from '@/utils/misc';

const View = ({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getCabinet>>['data']>;
}) => {
  const { logo, primaryImage, secondaryImage, ...rest } = data;
  const router = useRouter();

  const [previews, setPreviews] = useState<Record<string, string>>({
    logo: getUploaded(logo),
    primaryImage: getUploaded(primaryImage),
    secondaryImage: getUploaded(secondaryImage),
  });
  const form = useFormik<Partial<CreateUpdateCabinet>>({
    initialValues: {
      ...rest,
      primaryColor: rest.primaryColor ?? '',
      onPrimaryColor: rest.onPrimaryColor ?? '',
    },
    validationSchema: updateCabinetSchema,
    onSubmit: async (val, { setSubmitting }) => {
      setSubmitting(true);
      const { status, message } = await updateCabinet(data.id, val);
      if (status) toast[status](message);
      if (status == 'success') router.replace('/admin/himatif/kabinet');
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
              onCheckedChange={(v) => form.setFieldValue('isActive', v)}
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
                  list={CabinetContacts}
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

export default View;
