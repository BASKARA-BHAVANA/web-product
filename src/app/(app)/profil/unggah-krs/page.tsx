import { Button } from '@/components/atoms/button';
import { Card, CardContent } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import Container from '@/components/molecules/container';
import { FlashActionResult } from '@/components/molecules/flash';
import Headline from '@/components/molecules/headline';
import React from 'react';
import { uploadKrs } from '../actions';
import { auth } from '@/lib/actions/auth';

const Page = async () => {
  await auth();

  return (
    <>
      <Container className="max-w-xl">
        <Headline
          className="mb-12 items-center"
          largeTexts={['Profil']}
          headText="Unggah KRS"
        />
        <FlashActionResult />
        <Card>
          <CardContent>
            <form action={uploadKrs} className="flex gap-2">
              <Input name="krs" type="file" accept="application/pdf" />
              <Button type="submit">Kirim</Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Page;
