import * as y from 'yup';

export const createUpdateCabinetSchema = y.object({
  name: y.string().required('Wajib diisi'),
  slug: y.string().required('Wajib diisi'),
  startYear: y.number().required('Wajib diisi'),
  endYear: y.number().required('Wajib diisi'),
  description: y.string().required('Wajib diisi'),
  tagline: y.string().required('Wajib diisi'),
  vision: y.string().required('Wajib diisi'),
  mission: y.string().required('Wajib diisi'),
  logoPath: y.string().optional(),
  firstImagePath: y.string().optional(),
  secondImagePath: y.string().optional(),
  isActive: y.boolean().required(),
  contacts: y
    .array()
    .of(
      y
        .object({
          key: y.string().required('Wajib diisi'),
          value: y.string().required('Wajib diisi'),
          label: y.string().optional(),
        })
        .required()
    )
    .optional(),
});

export type CreateUpdateCabinet = y.InferType<typeof createUpdateCabinetSchema>;
