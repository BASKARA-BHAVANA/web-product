'use client';

import React, {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button } from '@/components/atoms/button';
import { Edit2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { deleteCabinet, getCabinets, getCabinetsProps } from './actions';
import { toast } from 'sonner';
import DataTable from '@/components/molecules/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { getInitials } from '@/utils/string';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  // data listing
  const [listProps, setListProps] = useState<getCabinetsProps>({
    page: 1,
    limit: 20,
  });
  const [list, getResult, listLoading] = useActionState(
    (_: unknown, props: getCabinetsProps) => getCabinets(props),
    { message: '' }
  );

  const _getResult = useCallback(() => {
    startTransition(() => {
      getResult(listProps);
    });
  }, [getResult, listProps]);

  useEffect(() => _getResult(), [listProps]);

  useEffect(() => {
    if (list.status && list.status != 'success')
      toast[list.status](list.message);
  }, [list]);

  // data removing
  const [remove, postRemove, removeLoading] = useActionState(
    (_: unknown, id: string) => deleteCabinet(id),
    { message: '' }
  );

  useEffect(() => {
    if (remove.status) {
      toast[remove.status](remove.message);
      if (remove.status === 'success') _getResult();
    }
  }, [remove]);

  return (
    <div>
      <h1 className="typo-h1 mb-4 grow">Kabinet</h1>

      <DataTable
        loading={listLoading || removeLoading}
        data={list.data?.items ?? []}
        filters={[
          {
            label: 'Cari',
            onValueChange: (v) =>
              setListProps((s) => ({ ...s, page: 1, search: v as string })),
            type: 'search',
            value: listProps.search ?? '',
          },
        ]}
        slotTopRight={
          <Button asChild>
            <Link href={'kabinet/tambah'}>
              <PlusIcon />
              Baru
            </Link>
          </Button>
        }
        cols={[
          {
            key: 'cabinet',
            label: 'Kabinet',
            cell: ({ row }) => (
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={row.original.logo ?? ''}
                    alt={row.original.name ?? ''}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(row.original.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <p className="typo-p truncate">{row.original.name}</p>
                  <span className="typo-small text-muted-foreground">
                    {row.original.periode}{' '}
                    {row.original.isActive && (
                      <span className="typo-small text-green-500">AKTIF</span>
                    )}
                  </span>
                </div>
              </div>
            ),
          },
          {
            key: 'count_divisions',
            label: 'Divisi',
            cell: ({ row }) => (
              <p className="text-p">{row.original._count.divisions}</p>
            ),
          },
          {
            key: 'count_program',
            label: 'Program kerja',
            cell: ({ row }) => (
              <p className="text-p">{row.original._count.programs}</p>
            ),
          },
        ]}
        rowActions={[
          {
            icon: Edit2Icon,
            label: 'Edit',
            onClick: (data) => {
              router.push(`kabinet/${data.id}/edit`);
            },
          },
          {
            icon: Trash2Icon,
            label: 'Hapus',
            onClick: (data) => {
              toast.warning(`Hapus '${data.name}'?`, {
                action: {
                  label: 'Ya',
                  onClick: () => {
                    startTransition(() => postRemove(data.id));
                  },
                },
              });
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
