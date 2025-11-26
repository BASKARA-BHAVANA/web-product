import Form from '../form';
import { auth } from '@/lib/actions/auth';

const Page = async () => {
  await auth(['ADMIN', 'SUPERADMIN']);

  return <Form />;
};

export default Page;
