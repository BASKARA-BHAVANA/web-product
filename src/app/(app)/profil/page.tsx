import { Button } from '@/components/atoms/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { List, ListSimpleItem } from '@/components/atoms/list';
import { ShineBorder } from '@/components/atoms/shine-border';
import Container from '@/components/molecules/container';
import { FlashActionResult } from '@/components/molecules/flash';
import { Faculties } from '@/data/faculties';
import { Majors } from '@/data/majors';
import { auth } from '@/lib/actions/auth';
import { prisma } from '@/lib/prisma';
import { getOption } from '@/utils/option';
import { ArrowUpRightIcon, GraduationCapIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Page = async () => {
  const session = await auth();

  const scholar = await prisma.scholar.findUnique({
    where: { userId: session?.user.id },
  });

  return (
    <>
      <Container>
        <FlashActionResult />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon size={24} />
              Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <List>
              <ListSimpleItem label="Nama">{session?.user.name}</ListSimpleItem>
              <ListSimpleItem label="Email">
                {session?.user.email}
              </ListSimpleItem>
              <ListSimpleItem label="Role">{session?.user.role}</ListSimpleItem>
            </List>
          </CardContent>
        </Card>

        {!scholar ? (
          <Card className="border-border bg-primary/15 relative">
            <ShineBorder
              shineColor={['#FFE100', '#FEF500', '#C8FF5D']}
              borderWidth={3}
            />
            <CardHeader>
              <CardTitle>Lengkapi Profil Mahasiswa Kamu!</CardTitle>
              <CardDescription>
                Yuk, unggah KRS kamu sekarang untuk mengakses berbagai konten
                ekslusif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="mt-6" asChild>
                <Link href={'/profil/unggah-krs'}>
                  Unggah KRS <ArrowUpRightIcon />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCapIcon size={24} />
                Profil Mahasiswa
              </CardTitle>
              <CardAction>
                <Button asChild>
                  <Link href={'/profil/unggah-krs'}>
                    Perbarui <ArrowUpRightIcon />
                  </Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <List>
                <ListSimpleItem label="Nama">{scholar.name}</ListSimpleItem>
                <ListSimpleItem label="NIM">{scholar.nim}</ListSimpleItem>
                <ListSimpleItem label="Jenjang">
                  {scholar.degree}
                </ListSimpleItem>
                <ListSimpleItem label="Angkatan">
                  {scholar.cohort}
                </ListSimpleItem>
                <ListSimpleItem label="Fakultas">
                  {getOption(Faculties, scholar.faculty)?.label ?? ''}
                </ListSimpleItem>
                <ListSimpleItem label="Program studi">
                  {getOption(Majors, scholar.major)?.label ?? ''}
                </ListSimpleItem>
              </List>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Page;
