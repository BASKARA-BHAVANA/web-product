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
        (value) => (value ? ['image/png'].includes((value as File).type) : true)
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (value) => (value ? (value as File).size <= 3 * 1024 * 1024 : true)
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
        (value) =>
          value
            ? ['image/png', 'image/jpeg', 'image/jpg'].includes(
                (value as File).type
              )
            : true
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (value) => (value ? (value as File).size <= 3 * 1024 * 1024 : true)
      ),
    secondaryImage: y
      .mixed<File>()
      .required('Wajib diisi')
      .test(
        'fileType',
        'Jenis fail tidak valid. Hanya .png .jpg .jpeg yang diizinkan.',
        (value) =>
          value
            ? ['image/png', 'image/jpeg', 'image/jpg'].includes(
                (value as File).type
              )
            : true
      )
      .test(
        'fileSize',
        'Fail terlalu besar. Ukuran maksimum adalah 3MB.',
        (value) => (value ? (value as File).size <= 3 * 1024 * 1024 : true)
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
