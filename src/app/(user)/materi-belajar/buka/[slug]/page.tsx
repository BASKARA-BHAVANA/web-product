import ActionResultAlert from '@/components/molecules/action-result-alert';
import Container from '@/components/molecules/container';
import { detailCourse, exploreCourses } from '../../actions';
import View from './view';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const result = await detailCourse(params.slug);
  const related = await exploreCourses({ parentSlug: params.slug, limit: 10 });

  if (result.status == 'success' && result.data)
    return <View data={result.data} relatedData={related.data} />;

  return (
    <Container>
      <ActionResultAlert result={result} />
    </Container>
  );
};

export default Page;
