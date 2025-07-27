import { isFileSizeUnder, isValidFileType, YupFileType } from '@/utils/yup';
import * as y from 'yup';

export const EventImageFileTypes: YupFileType[] = [
  'image/jpg',
  'image/jpeg',
  'image/png',
];
export const EventImageFileSize = 3;

export interface CreateEvent {
  title: string;
  image?: File;
  location?: string;
  longlat?: string;
  content?: string;
  startDate: string;
  endDate?: string;
  isActive?: boolean;
}

export const createEventSchema: y.ObjectSchema<CreateEvent> = y.object({
  title: y.string().required('Wajib diisi'),
  image: y
    .mixed<File>()
    .optional()
    .test(
      'fileType',
      'Jenis fail tidak valid. Hanya .png .jpeg .jpg yang diizinkan.',
      (v) => isValidFileType(v, EventImageFileTypes)
    )
    .test('fileSize', 'Fail terlalu besar. Ukuran maksimum adalah 3MB.', (v) =>
      isFileSizeUnder(v, EventImageFileSize)
    ),
  location: y.string().optional(),
  longlat: y.string().optional(),
  content: y.string().optional(),
  startDate: y.string().required('Wajib diisi'),
  endDate: y.string().optional(),
  isActive: y.bool().optional(),
});

export interface UpdateEvent {
  title?: string;
  image?: File;
  location?: string;
  longlat?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export const updateEventSchema: y.ObjectSchema<UpdateEvent> = y.object({
  title: y.string().optional(),
  image: y
    .mixed<File>()
    .optional()
    .test(
      'fileType',
      'Jenis fail tidak valid. Hanya .png .jpeg .jpg yang diizinkan.',
      (v) => isValidFileType(v, EventImageFileTypes)
    )
    .test('fileSize', 'Fail terlalu besar. Ukuran maksimum adalah 3MB.', (v) =>
      isFileSizeUnder(v, EventImageFileSize)
    ),
  location: y.string().optional(),
  longlat: y.string().optional(),
  content: y.string().optional(),
  startDate: y.string().optional(),
  endDate: y.string().optional(),
  isActive: y.bool().optional(),
});
