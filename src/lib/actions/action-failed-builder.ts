import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ValidationError as YupValidationError } from 'yup';
import { ActionFailed } from './action-result';

const buildActionFailed = (error: unknown): ActionFailed => {
  if (error instanceof ActionFailed) return error;

  let message = '';
  const stack: string[] = [];

  if (process.env.NODE_ENV == 'development') console.log(error);

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code == 'P2003') {
      message = 'Data ini tidak bisa diubah karena terhubung dengan data lain.';
    } else if (error.code == 'P2025') {
      message = 'Data tidak ditemukan';
    }
  } else if (error instanceof YupValidationError) {
    message = 'Validasi gagal';
    error.inner?.forEach((e) => {
      stack.push(`${e.path}: ${e.message}`);
    });
  }
  return new ActionFailed(message, stack);
};

export { buildActionFailed };
