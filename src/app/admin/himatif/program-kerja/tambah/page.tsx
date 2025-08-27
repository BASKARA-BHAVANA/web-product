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
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getDivisions, getCabinets, createWorkProgram } from '../actions';
import { InputSelect } from '@/components/atoms/select';
import {
  CreateUpdateWorkProgram,
  createWorkProgramSchema,
  WorkProgramPictureTypes,
} from '../model';
import RichTextEditor from '@/components/molecules/richtext-editor';
import { Switch } from '@/components/atoms/switch';

const Page = () => {
  const router = useRouter();

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const form = useFormik<CreateUpdateWorkProgram>({
    initialValues: {
      cabinetId: '',
      divisionId: '',
      title: '',
      description: '',
      content: '',
      picture: undefined,
      isPinned: false,
    },
    validationSchema: createWorkProgramSchema,
    onSubmit: async (val, { setSubmitting }) => {
      setSubmitting(true);
      const { status, message } = await createWorkProgram(val);
      if (status) toast[status](message);
      if (status == 'success') router.replace('/admin/himatif/program-kerja');
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

  // divisions
  const [listDivision, getListDivision] = useActionState(
    (_: unknown, cabinetId: string) => getDivisions({ cabinetId }),
    {
      message: '',
    }
  );

  const _getListDivision = () => {
    startTransition(() => {
      if (form.values.cabinetId) getListDivision(form.values.cabinetId);
    });
  };

  useEffect(() => _getListDivision(), [form.values.cabinetId]);

  return (
    <>
      <div className="mb-4">
        <h1 className="typo-h1 grow">Tambah Program Kerja</h1>
      </div>

      <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informasi utama</CardTitle>
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
            <InputSelect
              label="Divisi"
              disabled={!form.values.cabinetId}
              value={form.values.divisionId}
              error={form.errors.divisionId}
              onValueChange={(v) => form.setFieldValue('divisionId', v)}
              list={listDivision.data ?? []}
              valueKey={'id'}
              labelKey={'name'}
            />
            <Input
              label="Nama"
              name="title"
              value={form.values.title}
              error={form.errors.title}
              onChange={form.handleChange}
            />
            <Switch
              label="Sematkan"
              name="isPinned"
              checked={form.values.isPinned}
              error={form.errors.isPinned}
              onCheckedChange={(v) => form.setFieldValue('isPinned', v)}
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
              label="Gambar pendukung"
              accept={WorkProgramPictureTypes.join(',')}
              filePreview={previews['picture']}
              filePreviewClassName="aspect-video max-w-60"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) form.setFieldValue('picture', file);
                setPreviews((obj) => ({
                  ...obj,
                  ['picture']: file ? URL.createObjectURL(file) : '',
                }));
              }}
              error={form.errors.picture}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opsional</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pt-4">
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
            <Textarea
              label="Deskripsi"
              name="description"
              value={form.values.description}
              error={form.errors.description}
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
