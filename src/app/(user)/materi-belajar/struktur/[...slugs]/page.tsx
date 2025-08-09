import ActionResultAlert from '@/components/molecules/action-result-alert';
import Container from '@/components/molecules/container';
import { exploreCourses, getCourseParents } from '../../actions';
import View from './view';

const Page = async (props: {
  params: Promise<{ slugs: string[] }>;
  searchParams: Promise<{ limit?: number }>;
}) => {
  const params = await props.params;
  const sParams = await props.searchParams;

  const fixSlugs = params.slugs.slice(1);
  const headSlug = fixSlugs.at(-1);

  const result = await exploreCourses({
    parentSlug: headSlug,
    limit: +(sParams.limit ?? 20),
  });
  const parents = headSlug
    ? await getCourseParents({
        slug: headSlug,
      })
    : undefined;

  if (result.status == 'success' && result.data)
    return (
      <View
        slugs={params.slugs}
        data={result.data}
        parents={parents?.data ?? undefined}
      />
    );

  return (
    <Container>
      <ActionResultAlert result={result} />
    </Container>
  );
};

export default Page;
