import { Button } from '@/components/atoms/button';
import { Card, CardContent } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import Container from '@/components/molecules/container';
import { FlashActionResult } from '@/components/molecules/flash';
import Headline from '@/components/molecules/headline';
import React from 'react';
import { uploadKrs } from '../actions';
import { auth } from '@/lib/actions/auth';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/atoms/accordion';

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
        <Card className="mb-6">
          <CardContent>
            <form action={uploadKrs} className="flex gap-2">
              <Input name="krs" type="file" accept="application/pdf" />
              <Button type="submit">Kirim</Button>
            </form>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible>
          <AccordionItem value="faq-1">
            <AccordionTrigger>
              Mengapa saya perlu mengunggah KRS?
            </AccordionTrigger>
            <AccordionContent>
              Pengunggahan KRS diperlukan agar Kamu dapat mengakses ke berbagai
              konten yang dirancang secara eksklusif untuk kelompok mahasiswa
              tertentu. Ini memastikan bahwa Kamu mendapatkan informasi dan
              layanan yang paling relevan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2">
            <AccordionTrigger>
              Seberapa aman KRS yang saya unggah?
            </AccordionTrigger>
            <AccordionContent>
              Sistem hanya mengekstrak beberapa data yang diperlukan dari file
              KRS. Sistem tidak mengambil keseluruhan isi-nya dan tidak
              menyimpan file KRS Kamu setelah proses ekstraksi selesai.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3">
            <AccordionTrigger>
              Bagaimana prosedur jika terjadi kesalahan saat sistem mengekstrak
              KRS?
            </AccordionTrigger>
            <AccordionContent>
              Jika Kamu mendapati adanya ketidaksesuaian atau kesalahan dalam
              ekstraksi data KRS, Silakan segera hubungi kontak Kabinet Himatif
              yang aktif.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Container>
    </>
  );
};

export default Page;
