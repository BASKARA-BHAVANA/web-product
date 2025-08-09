'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/atoms/breadcrumb';
import { param } from 'motion/react-client';
import { useRouter } from 'next/navigation';
import {
  Fragment,
  startTransition,
  use,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  deleteCourse,
  getCourses,
  getCoursesProps,
  getCoursesTitle,
  getCoursesTitleProps,
} from '../actions';
import { toast } from 'sonner';
import DataTable from '@/components/molecules/data-table';
import { Button } from '@/components/atoms/button';
import Link from 'next/link';
import {
  ChevronRightIcon,
  Edit2Icon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';

const Page = ({ params }: { params: Promise<{ slugs: string[] }> }) => {
  const router = useRouter();
  const { slugs } = use(params);
  const fixSlugs = slugs.slice(1);

  const [crumbs, getCrumbs] = useActionState(
    (_: unknown, props: getCoursesTitleProps) => getCoursesTitle(props),
    { message: '' }
  );

  useEffect(() => {
    startTransition(() => {
      getCrumbs({ slugs: fixSlugs });
    });
  }, []);

  // data listing
  const [listProps, setListProps] = useState<getCoursesProps>({
    parentSlug: fixSlugs.at(-1),
    page: 1,
    limit: 20,
  });
  const [list, getList, listLoading] = useActionState(
    (_: unknown, props: getCoursesProps) => getCourses(props),
    { message: '' }
  );

  const _getList = useCallback(() => {
    startTransition(() => {
      getList(listProps);
    });
  }, [getList, listProps]);

  useEffect(() => _getList(), [listProps]);

  // data removing
  const [remove, postRemove, removeLoading] = useActionState(
    (_: unknown, id: string) => deleteCourse(id),
    { message: '' }
  );

  useEffect(() => {
    if (remove.status) {
      toast[remove.status](remove.message);
      if (remove.status === 'success') _getList();
    }
  }, [remove]);

  return (
    <div>
      {crumbs.data?.items.length != 0 && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {crumbs.data?.items.map((item, i) => (
              <Fragment key={i}>
                {i != 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">{item.title}</BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <h1 className="typo-h1 mb-4 grow">
        {crumbs.data?.items.at(-1)?.title ?? 'Materi Belajar'}
      </h1>

      <DataTable
        loading={listLoading || removeLoading}
        data={list.data?.items ?? []}
        slotTopRight={
          <Button asChild>
            <Link
              href={
                fixSlugs.length
                  ? `/admin/belajar/materi-belajar/tambah?parent=${fixSlugs.at(-1)}`
                  : 'tambah'
              }
            >
              <PlusIcon />
              Baru
            </Link>
          </Button>
        }
        cols={[
          {
            key: 'title',
            label: 'Materi',
            cell: ({ row }) => (
              <div>
                <p className="typo-large line-clamp-2">{row.original.title}</p>
                <small className="typo-small text-muted-foreground truncate">
                  {row.original.tags?.split(';').join(',')}
                </small>
              </div>
            ),
          },
          {
            key: 'children',
            label: '',
            cell: ({ row }) => (
              <p className="typo-p">
                {row.original._count.children > 0
                  ? `${row.original._count.children} materi`
                  : ''}
              </p>
            ),
          },
        ]}
        rowActions={[
          {
            icon: Edit2Icon,
            label: 'Edit',
            onClick: (data) => {
              router.push(`acara/${data.id}/edit`);
            },
          },
          {
            icon: Trash2Icon,
            label: 'Hapus',
            onClick: (data) => {
              toast.warning(`Hapus '${data.title}'?`, {
                action: {
                  label: 'Ya',
                  onClick: () => {
                    startTransition(() => postRemove(data.id));
                  },
                },
              });
            },
          },
          {
            icon: ChevronRightIcon,
            label: 'Masuk',
            onClick: (data) => {
              router.push(`${[...slugs, data.slug].join('/')}`);
            },
          },
        ]}
        pagination={{
          count: list.data?.count ?? 0,
          index: listProps.page! - 1,
          size: listProps.limit!,
          onChange: ({ index, size }) => {
            setListProps((s) => ({
              ...s,
              page: index + 1,
              pageSize: size,
            }));
          },
        }}
      />
    </div>
  );
};

export default Page;
