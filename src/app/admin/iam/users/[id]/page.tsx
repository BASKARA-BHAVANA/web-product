'use client';

import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();

  return <div>{params.id}</div>;
};

export default Page;
