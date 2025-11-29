import * as y from 'yup';

export const createUpdateWorkProgramSchema = y.object({
  divisionId: y.string().optional(),
  cabinetId: y.string().required('Wajib diisi'),
  title: y.string().required('Wajib diisi'),
  slug: y.string().required('Wajib diisi'),
  description: y.string().required('Wajib diisi'),
  content: y.string().required('Wajib diisi'),
  startDate: y.string().optional(),
  endDate: y.string().optional(),
  picturePath: y.string().optional(),
  isPinned: y.bool().optional(),
});

export type CreateUpdateWorkProgram = y.InferType<
  typeof createUpdateWorkProgramSchema
>;
