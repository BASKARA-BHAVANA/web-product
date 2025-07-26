import { ValidationError as YupValidationError } from 'yup';
import { ActionFailed } from './action-result';
import { PrismaClientKnownRequestError } from '@/generated/prisma/runtime/library';

const buildActionFailed = (error: unknown): ActionFailed => {
  console.log(error);
  if (error instanceof ActionFailed) return error;

  let message = 'Terjadi kesalahan';
  const stack: string[] = [];

  const errorName = error?.constructor?.name;

  if (errorName == 'PrismaClientKnownRequestError') {
    const prismaError = error as PrismaClientKnownRequestError;

    if (prismaError.code == 'P2003') {
      message = 'Data ini tidak bisa diubah karena terhubung dengan data lain.';
    } else if (prismaError.code == 'P2025') {
      message = `Data tidak ditemukan`;
    }
  } else if (errorName == 'YupValidationError') {
    const yupError = error as YupValidationError;

    message = 'Validasi gagal';
    yupError.inner?.forEach((e) => {
      stack.push(`${e.path}: ${e.message}`);
    });
  } else {
    if (process.env.NODE_ENV == 'development') console.log(error);
  }

  return new ActionFailed(message, stack);
};

export { buildActionFailed };
