import * as y from 'yup';

export const createUpdateCourseSchema = y.object({
  courseId: y.string().optional(),
  title: y.string().required('Wajib diisi'),
  slug: y.string().required('Wajib diisi'),
  filePath: y.string().required('Wajib diisi'),
  content: y.string().required('Wajib diisi'),
  tags: y.string().optional(),
});

export type CreateUpdateCourse = y.InferType<typeof createUpdateCourseSchema>;
