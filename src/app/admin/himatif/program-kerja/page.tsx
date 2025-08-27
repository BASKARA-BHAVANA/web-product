'use client';

import React, {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button } from '@/components/atoms/button';
import { Edit2Icon, PinIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import DataTable from '@/components/molecules/data-table';
import { useRouter } from 'next/navigation';
import {
  deleteWorkProgram,
  getCabinets,
  getWorkPrograms,
  getWorkProgramsProps,
} from './actions';

const Page = () => {
  const router = useRouter();

  // data listing
  const [listProps, setListProps] = useState<getWorkProgramsProps>({
    page: 1,
    limit: 20,
  });
  const [list, getList, listLoading] = useActionState(
    (_: unknown, props: getWorkProgramsProps) => getWorkPrograms(props),
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
    (_: unknown, id: string) => deleteWorkProgram(id),
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
      <h1 className="typo-h1 mb-4 grow">Program Kerja</h1>

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
            <Link href={'program-kerja/tambah'}>
              <PlusIcon />
              Baru
            </Link>
          </Button>
        }
        cols={[
          {
            key: 'workprogram',
            label: 'Program',
            cell: ({ row }) => (
              <div className="min-w-60">
                <p className="typo-p line-clamp-2 flex items-center gap-1">
                  {row.original.title}
                  {row.original.isPinned && (
                    <PinIcon size={18} className="text-destructive" />
                  )}
                </p>
                <small className="typo-small text-muted-foreground line-clamp-2">
                  {row.original.description}
                </small>
              </div>
            ),
          },
          {
            key: 'cabinet',
            label: 'Kabinet',
            cell: ({ row }) => (
              <p className="typo-p">{row.original.cabinet?.name ?? '-'}</p>
            ),
          },
          {
            key: 'division',
            label: 'Divisi',
            cell: ({ row }) => (
              <p className="typo-p">{row.original.division?.name ?? '-'}</p>
            ),
          },
        ]}
        rowActions={[
          {
            icon: Edit2Icon,
            label: 'Edit',
            onClick: (data) => {
              router.push(`program-kerja/${data.id}/edit`);
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
