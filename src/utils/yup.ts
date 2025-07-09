export type YupFileType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/jpg'
  | 'application/pdf';

export const isValidFileType = (file: any, types: YupFileType[]) => {
  return file ? (types as string[]).includes((file as File).type) : true;
};

export const isFileSizeUnder = (file: any, mb: number) => {
  return file ? (file as File).size <= mb * 1024 * 1024 : true;
};
