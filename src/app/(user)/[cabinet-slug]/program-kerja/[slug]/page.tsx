import ActionResultAlert from '@/components/molecules/action-result-alert';
import View from './view';
import { getWorkProgramPageData } from '@/app/(user)/actions';
import Container from '@/components/molecules/container';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const result = await getWorkProgramPageData({
    workProgramSlug: params.slug,
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
