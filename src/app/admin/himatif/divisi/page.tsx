'use client';

import React, {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button } from '@/components/atoms/button';
import { Edit2Icon, PlusIcon, Trash2Icon, Users2Icon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import DataTable from '@/components/molecules/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { getInitials } from '@/utils/string';
import { useRouter } from 'next/navigation';
import {
  deleteDivision,
  getDivisions,
  getDivisionsProps,
  getCabinets,
} from './actions';

const Page = () => {
  const router = useRouter();

  // data listing
  const [listProps, setListProps] = useState<getDivisionsProps>({
    page: 1,
    limit: 20,
  });
  const [list, getList, listLoading] = useActionState(
    (_: unknown, props: getDivisionsProps) => getDivisions(props),
    { message: '' }
  );

  const _getList = useCallback(() => {
    startTransition(() => {
      getList(listProps);
    });
  }, [getList, listProps]);

  useEffect(() => _getList(), [listProps]);

  useEffect(() => {
    if (list.status && list.status != 'success')
      toast[list.status](list.message);
  }, [list]);

  // data removing
  const [remove, postRemove, removeLoading] = useActionState(
    (_: unknown, id: string) => deleteDivision(id),
    { message: '' }
  );

  useEffect(() => {
    if (remove.status) {
      toast[remove.status](remove.message);
      if (remove.status === 'success') _getList();
    }
  }, [remove]);

  // cabinets
  const [listCabinet, getListCabinet] = useActionState(getCabinets, {
    message: '',
  });

  const _getListCabinet = useCallback(() => {
    startTransition(() => {
      getListCabinet();
    });
  }, [getListCabinet]);

  useEffect(() => _getListCabinet(), []);

  return (
    <div>
      <h1 className="typo-h1 mb-4 grow">Divisi</h1>

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
          {
            label: 'Kabinet',
            onValueChange: (v) =>
              setListProps((s) => ({
                ...s,
                page: 1,
                cabinetIds: v as string[],
              })),
            type: 'checkbox',
            value: listProps.cabinetIds ?? [],
            options:
              listCabinet?.data?.map((c) => ({
                value: c.id,
                label: c.name,
              })) ?? [],
          },
        ]}
        slotTopRight={
          <Button asChild>
            <Link href={'divisi/tambah'}>
              <PlusIcon />
              Baru
            </Link>
          </Button>
        }
        cols={[
          {
            key: 'division',
            label: 'Divisi',
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
                </div>
              </div>
            ),
          },
          {
            key: 'count_members',
            label: 'Anggota',
            cell: ({ row }) => (
              <p className="text-p">{row.original._count.members}</p>
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
              router.push(`divisi/${data.id}/edit`);
            },
          },
          {
            icon: Users2Icon,
            label: 'Anggota',
            onClick: (data) => {
              router.push(`divisi/${data.id}/anggota`);
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
