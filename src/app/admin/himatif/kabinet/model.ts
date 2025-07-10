import { isFileSizeUnder, isValidFileType, YupFileType } from '@/utils/yup';
import * as y from 'yup';

export const CabinetContacts = [
  {
    value: 'address',
    label: 'Alamat',
  },
  {
    value: 'email',
    label: 'Email',
  },
  {
    value: 'whatsapp',
    label: 'Whatsapp',
  },
  {
    value: 'instagram',
    label: 'Instagram',
  },
  {
    value: 'tiktok',
    label: 'Tiktok',
  },
  {
    value: 'youtube',
    label: 'Youtube',
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
  },
];

export const LogoFileTypes: YupFileType[] = ['image/png'];
export const LogoFileSize = 3;
export const PrimaryImageFileTypes: YupFileType[] = [
  'image/png',
  'image/jpeg',
  'image/jpg',
];
export const PrimaryImageFileSize = 3;
export const SecondaryImageFileTypes: YupFileType[] = [
  'image/png',
  'image/jpeg',
  'image/jpg',
];
export const SecondaryImageFileSize = 3;

export interface CreateUpdateCabinet {
  name: string;
  tagline: string;
  logo?: File;
  periode: string;
  primaryColor?: string;
  onPrimaryColor?: string;
  primaryImage?: File;
  secondaryImage?: File;
  description: string;
  vision: string;
  mission: string;
  isActive: boolean;
  contacts?: {
    name?: string;
    key: string;
    value: string;
  }[];
}

export const createCabinetSchema: y.ObjectSchema<CreateUpdateCabinet> =
  y.object({
    name: y.string().required('Wajib diisi'),
    tagline: y.string().required('Wajib diisi'),
    logo: y
      .mixed<File>()
      .required('Wajib diisi')
      .test(
        'fileType',
        'Jenis fail tidak valid. Hanya .png yang diizinkan.',
        (v) => isValidFileType(v, LogoFileTypes)
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (v) => isFileSizeUnder(v, LogoFileSize)
      ),
    periode: y.string().required('Wajib diisi'),
    primaryColor: y.string().optional(),
    onPrimaryColor: y.string().optional(),
    primaryImage: y
      .mixed<File>()
      .required('Wajib diisi')
      .test(
        'fileType',
        'Jenis fail tidak valid. Hanya .png .jpg .jpeg yang diizinkan.',
        (v) => isValidFileType(v, PrimaryImageFileTypes)
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (v) => isFileSizeUnder(v, PrimaryImageFileSize)
      ),
    secondaryImage: y
      .mixed<File>()
      .required('Wajib diisi')
      .test(
        'fileType',
        'Jenis fail tidak valid. Hanya .png .jpg .jpeg yang diizinkan.',
        (v) => isValidFileType(v, SecondaryImageFileTypes)
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (v) => isFileSizeUnder(v, SecondaryImageFileSize)
      ),
    description: y.string().required('Wajib diisi'),
    vision: y.string().required('Wajib diisi'),
    mission: y.string().required('Wajib diisi'),
    isActive: y.boolean().required('Wajib diisi'),
    contacts: y
      .array()
      .of(
        y.object({
          name: y.string().optional(),
          key: y.string().required('Wajib diisi'),
          value: y.string().required('Wajib diisi'),
        })
      )
      .optional(),
  });

export const updateCabinetSchema: y.ObjectSchema<Partial<CreateUpdateCabinet>> =
  y.object({
    name: y.string().optional(),
    tagline: y.string().optional(),
    logo: y
      .mixed<File>()
      .optional()
      .test(
        'fileType',
        'Jenis fail tidak valid. Hanya .png yang diizinkan.',
        (v) => isValidFileType(v, LogoFileTypes)
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (v) => isFileSizeUnder(v, LogoFileSize)
      ),
    periode: y.string().optional(),
    primaryColor: y.string().optional(),
    onPrimaryColor: y.string().optional(),
    primaryImage: y
      .mixed<File>()
      .optional()
      .test(
        'fileType',
        'Jenis fail tidak valid. Hanya .png .jpg .jpeg yang diizinkan.',
        (v) => isValidFileType(v, PrimaryImageFileTypes)
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (v) => isFileSizeUnder(v, PrimaryImageFileSize)
      ),
    secondaryImage: y
      .mixed<File>()
      .optional()
      .test(
        'fileType',
        'Jenis fail tidak valid. Hanya .png .jpg .jpeg yang diizinkan.',
        (v) => isValidFileType(v, SecondaryImageFileTypes)
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (v) => isFileSizeUnder(v, SecondaryImageFileSize)
      ),
    description: y.string().optional(),
    vision: y.string().optional(),
    mission: y.string().optional(),
    isActive: y.boolean().optional(),
    contacts: y
      .array()
      .of(
        y.object({
          name: y.string().optional(),
          key: y.string().required('Wajib diisi'),
          value: y.string().required('Wajib diisi'),
        })
      )
      .optional(),
  });
