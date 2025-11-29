'use client';

import { Button } from '@/components/atoms/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { Cabinet, CabinetContact } from '@/generated/prisma';
import { useFormik } from 'formik';
import React from 'react';
import { CreateUpdateCabinet, createUpdateCabinetSchema } from '../schema';
import { toast } from 'sonner';
import { createCabinet, updateCabinet } from '../actions';
import InputField from '@/components/atoms/input-field';
import { Input } from '@/components/atoms/input';
import { isURL, toSlug } from '@/utils/string';
import { Textarea } from '@/components/atoms/textarea';
import Image from 'next/image';
import { InputSelect } from '@/components/atoms/select';
import { CabinetContactKeys } from '@/data/cabinets';
import { Switch } from '@/components/atoms/switch';

const FormCabinet = ({
  data,
  onSaved,
}: {
  data?: Cabinet & { contacts: CabinetContact[] };
  onSaved?: (data?: Cabinet) => void;
}) => {
  const form = useFormik<CreateUpdateCabinet>({
    initialValues: {
      name: data?.name ?? '',
      slug: data?.slug ?? '',
      startYear: data?.startYear ?? 2025,
      endYear: data?.endYear ?? 2026,
      description: data?.description ?? '',
      tagline: data?.tagline ?? '',
      vision: data?.vision ?? '',
      mission: data?.mission ?? '',
      logoPath: data?.logoPath ?? '',
      firstImagePath: data?.firstImagePath ?? '',
      secondImagePath: data?.secondImagePath ?? '',
      isActive: data?.isActive ?? false,
      contacts: data?.contacts ?? [],
    },
    validationSchema: createUpdateCabinetSchema,
    onSubmit: async (val) => {
      const res = await (data?.id
        ? updateCabinet({ id: data.id, data: val })
        : createCabinet({ data: val }));

      const msg = data?.id ? 'mengedit kabinet' : 'menambahkan kabinet';
      if (res.success) {
        toast.success('Berhasil ' + msg);
        onSaved?.(res.data);
      } else toast.error(res.message ?? 'Gagal ' + msg);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data?.id ? 'Edit' : 'Tambah'} Kabinet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit} className="flex flex-col gap-6">
          <InputField
            label="Kabinet aktif"
            error={form.errors.isActive}
            required
          >
            <Switch
              checked={form.values.isActive}
              onCheckedChange={(s) => form.setFieldValue('isActive', s)}
            />
          </InputField>

          <InputField label="Judul" error={form.errors.name} required>
            <Input
              id="name"
              name="name"
              value={form.values.name}
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

          <div className="flex items-center gap-3">
            <InputField
              label="Periode mulai"
              error={form.errors.startYear}
              required
            >
              <Input
                type="number"
                id="startYear"
                name="startYear"
                value={form.values.startYear}
                onChange={form.handleChange}
              />
            </InputField>
            <InputField
              label="Periode selesai"
              error={form.errors.endYear}
              required
            >
              <Input
                type="number"
                id="endYear"
                name="endYear"
                value={form.values.endYear}
                onChange={form.handleChange}
              />
            </InputField>
          </div>

          <InputField
            label="Tagline / Slogan"
            error={form.errors.tagline}
            required
          >
            <Input
              id="tagline"
              name="tagline"
              value={form.values.tagline}
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

          <InputField label="Visi" error={form.errors.vision} required>
            <Textarea
              id="vision"
              name="vision"
              value={form.values.vision}
              onChange={form.handleChange}
            />
          </InputField>

          <InputField
            label="Misi"
            hint="Setiap baris akan dianggap sebagai poin dan ditampilkan dalam bentuk daftar."
            error={form.errors.mission}
            required
          >
            <Textarea
              id="mission"
              name="mission"
              value={form.values.mission}
              onChange={form.handleChange}
            />
          </InputField>

          {form.values.logoPath &&
            isURL(form.values.logoPath, [
              'cdn.jsdelivr.net',
              'res.cloudinary.com',
            ]) && (
              <Image
                src={form.values.logoPath}
                className="aspect-square size-full max-w-xs rounded-xl border"
                alt=""
                width={1080}
                height={720}
              />
            )}

          <InputField
            label="URL logo"
            error={form.errors.logoPath}
            hint="Salin tautan dari domain cdn.jsdelivr.net atau res.cloudinary.com"
          >
            <Input
              id="logoPath"
              name="logoPath"
              value={form.values.logoPath ?? ''}
              onChange={form.handleChange}
            />
          </InputField>

          {form.values.firstImagePath &&
            isURL(form.values.firstImagePath, [
              'cdn.jsdelivr.net',
              'res.cloudinary.com',
            ]) && (
              <Image
                src={form.values.firstImagePath}
                className="aspect-video size-full max-w-md rounded-xl border"
                alt=""
                width={1080}
                height={720}
              />
            )}

          <InputField
            label="URL foto dekorasi satu"
            error={form.errors.firstImagePath}
            hint="Salin tautan dari domain cdn.jsdelivr.net atau res.cloudinary.com"
          >
            <Input
              id="firstImagePath"
              name="firstImagePath"
              value={form.values.firstImagePath ?? ''}
              onChange={form.handleChange}
            />
          </InputField>

          {form.values.secondImagePath &&
            isURL(form.values.secondImagePath, [
              'cdn.jsdelivr.net',
              'res.cloudinary.com',
            ]) && (
              <Image
                src={form.values.secondImagePath}
                className="aspect-video size-full max-w-md rounded-xl border"
                alt=""
                width={1080}
                height={720}
              />
            )}

          <InputField
            label="URL foto dekorasi dua"
            error={form.errors.secondImagePath}
            hint="Salin tautan dari domain cdn.jsdelivr.net atau res.cloudinary.com"
          >
            <Input
              id="secondImagePath"
              name="secondImagePath"
              value={form.values.secondImagePath ?? ''}
              onChange={form.handleChange}
            />
          </InputField>

          <p className="typo-large">Daftar Kontak</p>
          {form.values.contacts?.map((con, i) => (
            <div
              key={i}
              className="border-primary-foreground flex flex-wrap items-start gap-6 rounded-md border p-6"
            >
              <InputField
                required
                label="Saluran"
                error={(form.errors.contacts?.[i] as any)?.key}
              >
                <InputSelect
                  list={CabinetContactKeys}
                  valueKey={'value'}
                  labelKey={'label'}
                  value={con.key}
                  onValueChange={(v) =>
                    form.setFieldValue(`contacts[${i}].key`, v)
                  }
                />
              </InputField>

              <InputField
                required
                label="Kontak"
                className="grow"
                error={(form.errors.contacts?.[i] as any)?.value}
              >
                <Input
                  placeholder="cont: 08123456789"
                  name={`contacts[${i}].value`}
                  value={con.value}
                  onChange={form.handleChange}
                />
              </InputField>

              <InputField
                label="Label"
                error={(form.errors.contacts?.[i] as any)?.label}
              >
                <Input
                  placeholder="cont: Diaz"
                  name={`contacts[${i}].label`}
                  value={con.label}
                  onChange={form.handleChange}
                />
              </InputField>

              <div>
                <Button
                  variant={'secondary'}
                  size={'sm'}
                  type="button"
                  onClick={() =>
                    form.setFieldValue('contacts', [
                      ...(form.values.contacts ?? []).filter((_, j) => j != i),
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

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={form.isSubmitting}>
              {form.isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormCabinet;
