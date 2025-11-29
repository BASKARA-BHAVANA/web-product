import { auth } from '@/lib/actions/auth';
import React from 'react';
import FormCabinet from '../forms/form-cabinet';
import Container from '@/components/molecules/container';

const Page = async () => {
  await auth(['ADMIN', 'SUPERADMIN']);

  return (
    <Container>
      <FormCabinet />
    </Container>
  );
};

export default Page;
