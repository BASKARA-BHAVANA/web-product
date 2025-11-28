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
import { Cabinet, Division, DivisionMember } from '@/generated/prisma';
import Image from 'next/image';
import { CreateUpdateDivision, createUpdateDivisionSchema } from '../schema';
import { createDivision, updateDivision } from '../actions';
import { Textarea } from '@/components/atoms/textarea';
import Link from 'next/link';

const Form = ({
  cabinet,
  data,
}: {
  data?: Division & { members?: DivisionMember[] };
  cabinet?: Pick<Cabinet, 'id' | 'slug' | 'name' | 'logoPath'>;
}) => {
  const nav = useRouter();

  const form = useFormik<CreateUpdateDivision>({
    initialValues: {
      cabinetId: data?.cabinetId ?? cabinet?.id ?? '',
      name: data?.name ?? '',
      slug: data?.slug ?? '',
      tagline: data?.tagline ?? '',
      description: data?.description ?? '',
      logoPath: data?.logoPath ?? '',
      members: data?.members ?? [],
    },
    validationSchema: createUpdateDivisionSchema,
    onSubmit: async (val) => {
      const res = await (data?.id
        ? updateDivision({ id: data.id, data: val })
        : createDivision({ data: val }));

      const msg = data?.id ? 'mengedit divisi' : 'menambahkan divisi';
      if (res.success) {
        toast.success('Berhasil ' + msg);
        nav.replace(
          `/himatif/${cabinet?.slug ?? '0'}/divisi/${res.data?.slug ?? '0'}`
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
          <CardTitle>{data?.id ? 'Edit' : 'Tambah'} Divisi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit} className="flex flex-col gap-6">
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

            {form.values.logoPath &&
              isURL(form.values.logoPath, [
                'cdn.jsdelivr.net',
                'res.cloudinary.com',
              ]) && (
                <Image
                  src={form.values.logoPath}
                  className="aspect-square size-full max-w-3xs rounded-xl border"
                  alt=""
                  width={300}
                  height={300}
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

            <p className="typo-large">Anggota</p>
            {form.values.members?.map((member, i) => (
              <div
                key={i}
                className="border-primary-foreground flex flex-col gap-6 rounded-md border p-6"
              >
                {member.picturePath &&
                  isURL(member.picturePath, [
                    'cdn.jsdelivr.net',
                    'res.cloudinary.com',
                  ]) && (
                    <Image
                      src={member.picturePath}
                      className="aspect-square size-full max-w-3xs rounded-xl border"
                      alt=""
                      width={300}
                      height={300}
                    />
                  )}

                <InputField
                  label="Foto"
                  error={(form.errors.members?.[i] as any)?.picturePath}
                  hint="Salin tautan dari domain cdn.jsdelivr.net atau res.cloudinary.com"
                >
                  <Input
                    name={`members[${i}].picturePath`}
                    value={member.picturePath ?? ''}
                    onChange={form.handleChange}
                  />
                </InputField>

                <InputField
                  label="Nama"
                  className="grow"
                  error={(form.errors.members?.[i] as any)?.name}
                  required
                >
                  <Input
                    name={`members[${i}].name`}
                    value={member.name}
                    onChange={form.handleChange}
                  />
                </InputField>

                <InputField
                  label="Posisi"
                  error={(form.errors.members?.[i] as any)?.position}
                  required
                >
                  <Input
                    name={`members[${i}].position`}
                    value={member.position}
                    onChange={form.handleChange}
                  />
                </InputField>

                <div>
                  <Button
                    variant={'secondary'}
                    size={'sm'}
                    type="button"
                    onClick={() =>
                      form.setFieldValue('members', [
                        ...(form.values.members ?? []).filter((_, j) => j != i),
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
                  form.setFieldValue('members', [
                    ...(form.values.members ?? []),
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
    </Container>
  );
};

export default Form;
