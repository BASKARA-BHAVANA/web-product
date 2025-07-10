'use server';

import fs from 'fs/promises';
import path from 'path';

export type FileAccess = 'public' | 'private';

export async function uploadFile(
  file: File,
  options?: { access: FileAccess; baseFolder?: string }
) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const folder = options?.access === 'public' ? 'public/uploads' : 'uploads';
    const baseFolder = options?.baseFolder ?? '';
    const subfolder = path.join(folder, baseFolder, year.toString(), month);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const fullPath = path.join(process.cwd(), subfolder, filename);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);

    const relativePath = path.join(
      baseFolder,
      year.toString(),
      month,
      filename
    );
    const publicPath =
      options?.access === 'public'
        ? `/uploads/${relativePath}`
        : `/${relativePath}`;

    return { path: publicPath };
  } catch (error) {
    return { error };
  }
}

export async function deleteFile(filePath: string) {
  try {
    const baseFolder = filePath.startsWith('/uploads') ? 'public' : 'uploads';
    const fullPath = path.join(process.cwd(), baseFolder, filePath);
    await fs.unlink(fullPath);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export async function deleteFiles(filePaths: string[]) {
  await Promise.allSettled(
    filePaths.map(async (filePath) => {
      try {
        const baseFolder = filePath.startsWith('/uploads')
          ? 'public'
          : 'uploads';
        const fullPath = path.join(process.cwd(), baseFolder, filePath);
        await fs.unlink(fullPath);
      } catch (error) {
        console.error(error);
      }
    })
  );
}
