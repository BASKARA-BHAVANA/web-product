import * as y from 'yup';

export const createUpdateArticleSchema = y.object({
  title: y.string().required('Wajib diisi'),
  slug: y.string().required('Wajib diisi'),
  content: y.string().required('Wajib diisi'),
  picturePath: y.string().optional(),
  author: y.string().optional(),
  tags: y.string().optional(),
});

export type CreateUpdateArticle = y.InferType<typeof createUpdateArticleSchema>;
