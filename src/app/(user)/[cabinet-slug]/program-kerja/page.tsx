import ActionResultAlert from '@/components/molecules/action-result-alert';
import View from './view';
import { getWorkProgramsPageData } from '@/app/(user)/actions';
import Container from '@/components/molecules/container';

const Page = async (props: {
  params: Promise<{ 'cabinet-slug': string }>;
  searchParams: Promise<{ search?: string; page?: number; limit?: number }>;
}) => {
  const params = await props.params;
  const sParams = await props.searchParams;
  const result = await getWorkProgramsPageData({
    cabinetSlug: params['cabinet-slug'],
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
