'use server';

import { flashGet } from '@/lib/actions/flash';
import { Alert, AlertDescription, AlertTitle } from '../atoms/alert';
import { ActionResult } from '@/@types/global';

const FlashActionResult = async () => {
  const flash = await flashGet<ActionResult>();
  if (!flash) return;

  return (
    <Alert className="mb-6" variant={flash.success ? 'success' : 'destructive'}>
      <AlertTitle>{flash.success ? 'Berhasil' : 'Gagal'}</AlertTitle>
      <AlertDescription>{flash.message}</AlertDescription>
    </Alert>
  );
};

export { FlashActionResult };
