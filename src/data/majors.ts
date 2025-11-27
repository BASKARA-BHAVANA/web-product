import { Option } from '@/utils/option';

const Majors: Option<string, { facultyId: string }>[] = [
  // ushuluddin
  { meta: { facultyId: '1' }, value: '101', label: 'Studi Agama Agama' },
  {
    meta: { facultyId: '1' },
    value: '102',
    label: 'Aqidah Dan Filsafat Islam',
  },
  { meta: { facultyId: '1' }, value: '103', label: "Ilmu Al Qur'an Tafsir" },
  { meta: { facultyId: '1' }, value: '104', label: 'Tasawuf Dan Psikoterapi' },
  { meta: { facultyId: '1' }, value: '106', label: 'Ilmu Hadits' },

  // Tarbiyah dan keguruan
  {
    meta: { facultyId: '2' },
    value: '201',
    label: 'Manajemen Pendidikan Islam',
  },
  { meta: { facultyId: '2' }, value: '202', label: 'Pendidikan Agama Islam' },
  { meta: { facultyId: '2' }, value: '203', label: 'Pendidikan Bahasa Arab' },
  {
    meta: { facultyId: '2' },
    value: '204',
    label: 'Pendidikan Bahasa inggris',
  },
  { meta: { facultyId: '2' }, value: '205', label: 'Pendidikan Matematika' },
  { meta: { facultyId: '2' }, value: '206', label: 'Pendidikan Biologi' },
  { meta: { facultyId: '2' }, value: '207', label: 'Pendidikan Fisika' },
  { meta: { facultyId: '2' }, value: '208', label: 'Pendidikan Kimia' },
  {
    meta: { facultyId: '2' },
    value: '209',
    label: 'Pendidikan Guru Madrasah Ibtidaiyah',
  },
  {
    meta: { facultyId: '2' },
    value: '210',
    label: 'Pendidikan Islam Anak Usia Dini',
  },
  { meta: { facultyId: '2' }, value: '212', label: 'Tadris Bahasa Indonesia' },

  // Syariah dan Hukum
  {
    meta: { facultyId: '3' },
    value: '301',
    label: 'Hukum Keluarga ( Ahwal Syakhsiyah )',
  },
  {
    meta: { facultyId: '3' },
    value: '302',
    label: 'Hukum Ekonomi Syariah ( Muamalah )',
  },
  {
    meta: { facultyId: '3' },
    value: '303',
    label: 'Hukum Tata Negara ( Siyasah )',
  },
  {
    meta: { facultyId: '3' },
    value: '304',
    label: 'Perbandingan Madzhab Dan Hukum',
  },
  { meta: { facultyId: '3' }, value: '305', label: 'Ilmu Hukum' },
  { meta: { facultyId: '3' }, value: '306', label: 'Hukum Pidana Islam' },

  // Dakwah Dan Komunikasi
  {
    meta: { facultyId: '4' },
    value: '401',
    label: 'Bimbingan konseling Islam',
  },
  {
    meta: { facultyId: '4' },
    value: '402',
    label: 'Komunikasi Penyiaran Islam',
  },
  { meta: { facultyId: '4' }, value: '403', label: 'Manajemen Dakwah' },
  {
    meta: { facultyId: '4' },
    value: '404',
    label: 'Pengembangan Masyarakat Islam',
  },
  {
    meta: { facultyId: '4' },
    value: '405',
    label: 'Ilmu Komunikasi Jurnalistik',
  },
  { meta: { facultyId: '4' }, value: '406', label: 'Ilmu Komunikasi Humas' },
  { meta: { facultyId: '4' }, value: '407', label: 'Manajemen Haji dan Umrah' },

  // Adab Dan Humaniora
  { meta: { facultyId: '5' }, value: '501', label: 'Sejarah peradaban Islam' },
  { meta: { facultyId: '5' }, value: '502', label: 'Bahasa Dan Sastra Arab' },
  { meta: { facultyId: '5' }, value: '503', label: 'Sastra Inggris' },
  {
    meta: { facultyId: '5' },
    value: '506',
    label: 'Ilmu Perpustakaan dan informasi Islam',
  },

  // Psikologi
  { meta: { facultyId: '6' }, value: '600', label: 'Psikologi' },

  // Sains dan Teknologi
  { meta: { facultyId: '7' }, value: '701', label: 'Matematika' },
  { meta: { facultyId: '7' }, value: '702', label: 'Biologi' },
  { meta: { facultyId: '7' }, value: '703', label: 'Fisika' },
  { meta: { facultyId: '7' }, value: '704', label: 'Kimia' },
  { meta: { facultyId: '7' }, value: '705', label: 'Teknik informatika' },
  { meta: { facultyId: '7' }, value: '706', label: 'Agroteknologi' },
  { meta: { facultyId: '7' }, value: '707', label: 'Teknik Elektro' },
  { meta: { facultyId: '7' }, value: '708', label: 'Teknik Lingkungan' },

  // Ilmu Sosial Dan Ilmu Politik
  { meta: { facultyId: '8' }, value: '801', label: 'Administrasi Publik' },
  { meta: { facultyId: '8' }, value: '803', label: 'Sosiologi' },
  { meta: { facultyId: '8' }, value: '804', label: 'Ilmu Politik' },

  // Ekonomi Dan bisnis Islam
  { meta: { facultyId: '9' }, value: '921', label: 'Akuntansi Syariah' },
  { meta: { facultyId: '9' }, value: '922', label: 'Ekonomi Syariah' },
  {
    meta: { facultyId: '9' },
    value: '923',
    label: 'Manajemen Keuangan Syariah',
  },
  { meta: { facultyId: '9' }, value: '924', label: 'Manajemen' },
  { meta: { facultyId: '9' }, value: '925', label: 'Manejemen Industri Halal' },
];

export { Majors };
