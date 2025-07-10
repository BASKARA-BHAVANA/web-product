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
import { Button } from '@/components/atoms/button';
import { InputSelect } from '@/components/atoms/select';
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getCabinets, getDivision, updateDivision } from '../../actions';
import { CreateUpdateDivision, updateDivisionSchema } from '../../model';

const View = ({
  data,
}: {
  data: NonNullable<Awaited<ReturnType<typeof getDivision>>['data']>;
}) => {
  const { logo, ...rest } = data;
  const router = useRouter();

  const [previews, setPreviews] = useState<Record<string, string>>({
    logo: logo ?? '',
  });
  const form = useFormik<Partial<CreateUpdateDivision>>({
    initialValues: {
      ...rest,
    },
    validationSchema: updateDivisionSchema,
    onSubmit: async (val, { setSubmitting }) => {
      setSubmitting(true);
      const { status, message } = await updateDivision(data.id, val);
      if (status) toast[status](message);
      if (status == 'success') router.replace('/admin/himatif/divisi');
      setSubmitting(false);
    },
  });

  // cabinets
  const [listCabinet, getListCabinet] = useActionState(getCabinets, {
    message: '',
  });

  const _getListCabinet = useCallback(() => {
    startTransition(() => {
      getListCabinet();
    });
  }, [getListCabinet]);

  useEffect(() => _getListCabinet(), []);

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
            <InputSelect
              label="Kabinet"
              value={form.values.cabinetId}
              error={form.errors.cabinetId}
              onValueChange={(v) => form.setFieldValue('cabinetId', v)}
              list={listCabinet.data ?? []}
              valueKey={'id'}
              labelKey={'name'}
            />
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
            <Textarea
              label="Deskripsi"
              name="description"
              value={form.values.description}
              error={form.errors.description}
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
