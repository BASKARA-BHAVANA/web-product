import * as y from 'yup';
import { prisma } from '../prisma';

export const scholarsFilterSchema = y.object({
  cohorts: y.array().of(y.string().required('Wajib diisi')).optional(),
  degrees: y.array().of(y.string().required('Wajib diisi')).optional(),
  faculties: y.array().of(y.string().required('Wajib diisi')).optional(),
  majors: y.array().of(y.string().required('Wajib diisi')).optional(),
});

export type ScholarsFilter = y.InferType<typeof scholarsFilterSchema>;

export const isScholarFilter = ({ rules }: { rules: any }) => {
  if (!rules || typeof rules !== 'object') return 0;

  const f = rules as Partial<ScholarsFilter>;

  return (
    f.cohorts?.length ||
    f.degrees?.length ||
    f.faculties?.length ||
    f.majors?.length
  );
};

export const checkScholarAccess = async (
  reference: any,
  userId: string
): Promise<boolean> => {
  const scholar = await prisma.scholar.findUnique({ where: { userId } });
  if (!scholar) return false;

  if (
    typeof reference !== 'object' ||
    reference === null ||
    Array.isArray(reference)
  ) {
    return false;
  }

  const check = (ref?: string[], val?: any) => {
    if (!ref || ref.length === 0) return true;
    if (val == null) return false;
    return ref.includes(String(val));
  };

  const safeRef = {
    cohorts: reference.cohorts ?? [],
    degrees: reference.degrees ?? [],
    faculties: reference.faculties ?? [],
    majors: reference.majors ?? [],
  };

  return (
    check(safeRef.cohorts, scholar.cohort) &&
    check(safeRef.degrees, scholar.degree) &&
    check(safeRef.faculties, scholar.faculty) &&
    check(safeRef.majors, scholar.major)
  );
};
