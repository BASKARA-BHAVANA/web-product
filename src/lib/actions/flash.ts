'use server';

import { cookies } from 'next/headers';

export async function flashSet(data: unknown) {
  const cookieStore = await cookies();
  cookieStore.set('flash', JSON.stringify(data), { path: '/', maxAge: 5 });
}

export async function flashGet<T>(): Promise<T | null> {
  const cookieStore = await cookies();
  const flash = cookieStore.get('flash');
  if (!flash) return null;
  try {
    return JSON.parse(flash.value) as T;
  } catch {
    return null;
  }
}
