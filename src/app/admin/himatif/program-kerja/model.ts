import { isFileSizeUnder, isValidFileType, YupFileType } from '@/utils/yup';
import * as y from 'yup';

export const WorkProgramPictureTypes: YupFileType[] = [
  'image/png',
  'image/jpeg',
  'image/jpg',
];
export const WorkProgramPictureSize = 3;

export interface CreateUpdateWorkProgram {
  divisionId?: string;
  cabinetId?: string;
  title: string;
  picture?: File;
  description?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  isPinned?: boolean;
}

export const createWorkProgramSchema: y.ObjectSchema<CreateUpdateWorkProgram> =
  y.object({
    divisionId: y.string().required('Wajib diisi'),
    cabinetId: y.string().required('Wajib diisi'),
    title: y.string().required('Wajib diisi'),
    picture: y
      .mixed<File>()
      .optional()
      .test(
        'fileType',
        'Jenis fail tidak valid. Hanya .png yang diizinkan.',
        (v) => isValidFileType(v, WorkProgramPictureTypes)
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (v) => isFileSizeUnder(v, WorkProgramPictureSize)
      ),
    description: y.string().optional(),
    content: y.string().optional(),
    startDate: y.string().optional(),
    endDate: y.string().optional(),
    isPinned: y.bool().optional().default(false),
  });

export const updateWorkProgramSchema: y.ObjectSchema<
  Partial<CreateUpdateWorkProgram>
> = y.object({
  divisionId: y.string().optional(),
  cabinetId: y.string().optional(),
  title: y.string().optional(),
  picture: y
    .mixed<File>()
    .optional()
    .test(
      'fileType',
      'Jenis fail tidak valid. Hanya .png yang diizinkan.',
      (v) => isValidFileType(v, WorkProgramPictureTypes)
    )
    .test('fileSize', 'Fail terlalu besar. Ukuran maksimum adalah 3MB.', (v) =>
      isFileSizeUnder(v, WorkProgramPictureSize)
    ),
  description: y.string().optional(),
  content: y.string().optional(),
  startDate: y.string().optional(),
  endDate: y.string().optional(),
  isPinned: y.bool().optional().default(false),
});
