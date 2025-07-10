import { isFileSizeUnder, isValidFileType, YupFileType } from '@/utils/yup';
import * as y from 'yup';

export const DivisionLogoFileTypes: YupFileType[] = ['image/png'];
export const DivisionLogoFileSize = 3;

export interface CreateUpdateDivision {
  cabinetId: string;
  name: string;
  tagline: string;
  logo?: File;
  description: string;
}

export const createDivisionSchema: y.ObjectSchema<CreateUpdateDivision> =
  y.object({
    cabinetId: y.string().required('Wajib diisi'),
    name: y.string().required('Wajib diisi'),
    tagline: y.string().required('Wajib diisi'),
    logo: y
      .mixed<File>()
      .required('Wajib diisi')
      .test(
        'fileType',
        'Jenis fail tidak valid. Hanya .png yang diizinkan.',
        (v) => isValidFileType(v, DivisionLogoFileTypes)
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (v) => isFileSizeUnder(v, DivisionLogoFileSize)
      ),
    description: y.string().required('Wajib diisi'),
  });

export const updateDivisionSchema: y.ObjectSchema<
  Partial<CreateUpdateDivision>
> = y.object({
  cabinetId: y.string().optional(),
  name: y.string().optional(),
  tagline: y.string().optional(),
  logo: y
    .mixed<File>()
    .optional()
    .test(
      'fileType',
      'Jenis fail tidak valid. Hanya .png yang diizinkan.',
      (v) => isValidFileType(v, DivisionLogoFileTypes)
    )
    .test('fileSize', 'Fail terlalu besar. Ukuran maksimum adalah 3MB.', (v) =>
      isFileSizeUnder(v, DivisionLogoFileSize)
    ),
  description: y.string().optional(),
});
