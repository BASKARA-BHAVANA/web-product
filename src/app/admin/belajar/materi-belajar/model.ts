import * as y from 'yup';

export interface CreateCourse {
  parentId?: string;
  title: string;
  file: string;
  content?: string;
  tags?: string[];
}

export const createCourseSchema: y.ObjectSchema<CreateCourse> = y.object({
  parentId: y.string(),
  title: y.string().required('Wajib diisi'),
  file: y.string().url().required('Wajib diisi'),
  content: y.string().optional(),
  tags: y.array().of(y.string().required()).optional(),
});

export interface UpdateCourse {
  parentId?: string;
  title?: string;
  file?: string;
  content?: string;
  tags?: string[];
}

export const updateCourseSchema: y.ObjectSchema<UpdateCourse> = y.object({
  parentId: y.string().optional(),
  title: y.string().optional(),
  file: y.string().url().optional(),
  content: y.string().optional(),
  tags: y.array().of(y.string().required()).optional(),
});
