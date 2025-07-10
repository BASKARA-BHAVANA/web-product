import ActionResultAlert from '@/components/molecules/action-result-alert';
import View from './view';
import { getHomePageData } from './actions';
import Container from '@/components/molecules/container';

const Page = async (props: { searchParams: Promise<{ kabinet: string }> }) => {
  const searchParams = await props.searchParams;
  const result = await getHomePageData({ cabinetSlug: searchParams.kabinet });

  if (result.status == 'success' && result.data)
    return <View data={result.data} />;

  return (
    <Container>
      <ActionResultAlert result={result} />
    </Container>
  );
};

export default Page;
