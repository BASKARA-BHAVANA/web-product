import * as y from 'yup';

export const createUpdateDivisionSchema = y.object({
  cabinetId: y.string().required('Wajib diisi'),
  name: y.string().required('Wajib diisi'),
  slug: y.string().required('Wajib diisi'),
  tagline: y.string().required('Wajib diisi'),
  description: y.string().required('Wajib diisi'),
  logoPath: y.string().optional(),
  members: y
    .array()
    .of(
      y.object({
        name: y.string().required('Wajib diisi'),
        position: y.string().required('Wajib diisi'),
        picturePath: y.string().nullable().optional(),
      })
    )
    .optional(),
});

export type CreateUpdateDivision = y.InferType<
  typeof createUpdateDivisionSchema
>;
