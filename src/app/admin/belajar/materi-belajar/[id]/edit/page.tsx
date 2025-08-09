import ActionResultAlert from '@/components/molecules/action-result-alert';
import View from './view';
import { getCourse } from '../../actions';

const Page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const result = await getCourse(params.id);

  if (result.status == 'success' && result.data)
    return <View data={result.data} />;

  return (
    <>
      <h1 className="typo-h1 mb-4">Edit Materi</h1>
      <ActionResultAlert result={result} />
    </>
  );
};

export default Page;
