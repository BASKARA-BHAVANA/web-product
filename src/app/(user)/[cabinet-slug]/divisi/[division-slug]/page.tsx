import ActionResultAlert from '@/components/molecules/action-result-alert';
import View from './view';
import { getDivisionPageData } from '@/app/(user)/actions';
import Container from '@/components/molecules/container';

const Page = async (props: {
  params: Promise<{ 'cabinet-slug': string; 'division-slug': string }>;
}) => {
  const params = await props.params;
  const result = await getDivisionPageData({
    cabinetSlug: params['cabinet-slug'],
    divisionSlug: params['division-slug'],
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
