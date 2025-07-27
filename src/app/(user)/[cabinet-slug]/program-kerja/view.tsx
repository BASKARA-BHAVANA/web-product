import Container from '@/components/molecules/container';
import { getWorkProgramsPageData } from '../../actions';
import { Input } from '@/components/atoms/input';
import { WorkProgramCardDefault } from '@/components/molecules/workprogram-cards';
import { EllipsisPagination } from '@/components/molecules/pagination-server';

const View = ({
  data,
}: {
  data: NonNullable<
    Awaited<ReturnType<typeof getWorkProgramsPageData>>['data']
  >;
}) => {
  const { cabinet, programs, search, limit, page, count } = data;

  return (
    <>
      <Container className="max-w-3xl py-12">
        <div className="mb-12 flex flex-col items-center -space-y-3">
          <div className="bg-primary flex items-center gap-3 rounded-lg p-3">
            <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
              {cabinet.name}
            </p>
            <p className="typo-large">Program Kerja</p>
          </div>
          <h1 className="typo-h1 bg-primary w-fit rounded-lg p-3">
            Langkah Nyata Kami
          </h1>
        </div>

        <form method="get">
          <Input
            autoFocus
            name="search"
            defaultValue={search}
            placeholder="Cari..."
          />
        </form>
      </Container>

      <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((dat, i) => (
          <WorkProgramCardDefault key={i} program={dat} />
        ))}
      </Container>

      <Container className="max-w-fit">
        <EllipsisPagination limit={limit} page={page} totalItems={count} />
      </Container>
    </>
  );
};

export default View;
