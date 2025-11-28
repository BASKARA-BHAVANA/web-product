import { ActionResult } from '@/@types/global';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@/generated/prisma/runtime/library';
import { ValidationError } from 'yup';

export const buildError = (err: any): ActionResult<any> => {
  let message = 'Terjadi kesalahan';

  if (process.env.NODE_ENV == 'development') console.log(err);

  if (err instanceof PrismaClientKnownRequestError && err.code == 'P2003') {
    message = 'Tidak dapat mengubah data ini karena terkait dengan data lain.';
  } else if (err instanceof PrismaClientValidationError) {
    if (err.message.includes('Unknown argument')) {
      const part = err.message.match(/Unknown argument `[^`]+`/);
      message = part ? part[0] : 'Unknown argument on request';
    } else if (err.message.includes('Unknown field')) {
      const part = err.message.match(
        /Unknown field `[^`]+` for select statement`/
      );
      message = part ? part[0] : 'Unknown field name on request';
    }
  } else if (
    err instanceof PrismaClientKnownRequestError &&
    err.code == 'P2025'
  ) {
    message = `${err.meta?.modelName ?? 'Data'} tidak ditemukan`;
  } else if (
    err instanceof PrismaClientKnownRequestError &&
    err.code == 'P2002'
  ) {
    const target =
      (err.meta?.driverAdapterError as any)?.cause?.originalMessage?.replace(
        /^duplicate key value violates unique constraint "(.*)_key"$/,
        '$1'
      ) ?? '';
    if (target)
      message = `Entri dengan nilai yang sama untuk ${target} sudah ada.`;
    else message = 'Terdapat nilai yang duplikat';
  } else if (err instanceof ValidationError) {
    message = 'Validasi gagal';
    // data = err.inner.map((i) => i.errors.join(', '));
  }

  return {
    success: false,
    message,
  };
};
