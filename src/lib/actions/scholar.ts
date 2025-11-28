import * as y from 'yup';

export const scholarsFilterSchema = y.object({
  cohorts: y.array().of(y.string().required('Wajib diisi')).optional(),
  degrees: y.array().of(y.string().required('Wajib diisi')).optional(),
  faculties: y.array().of(y.string().required('Wajib diisi')).optional(),
  majors: y.array().of(y.string().required('Wajib diisi')).optional(),
});

export type ScholarsFilter = y.InferType<typeof scholarsFilterSchema>;

export const isScholarFilter = ({ rules }: { rules: any }) => {
  if (!rules || typeof rules !== 'object') return null;

  const f = rules as Partial<ScholarsFilter>;

  return (
    f.cohorts?.length ||
    f.degrees?.length ||
    f.faculties?.length ||
    f.majors?.length
  );
};
