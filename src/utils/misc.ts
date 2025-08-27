import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUploaded(file?: string | null) {
  return file ? `/uploads?file=${file}` : '';
}
