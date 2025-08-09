import ActionResultAlert from '@/components/molecules/action-result-alert';
import Container from '@/components/molecules/container';
import { searchCourses } from '../actions';
import View from './view';

const Page = async (props: {
  searchParams: Promise<{ search?: string; page?: number; limit?: number }>;
}) => {
  const sParams = await props.searchParams;
  const result = await searchCourses({
    page: +(sParams.page ?? 1),
    limit: +(sParams.limit ?? 10),
    search: sParams.search,
  });

  if (result.status == 'success' && result.data)
    return <View data={result.data} />;

  return (
    <Container>
      <ActionResultAlert result={result} />
    </Container>
  );
};

export default Page;
