'use client';

import React, {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button } from '@/components/atoms/button';
import {
  Edit2Icon,
  FileTextIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import DataTable from '@/components/molecules/data-table';
import { useRouter } from 'next/navigation';
import { deleteEvent, getEvents, getEventsProps, updateEvent } from './actions';
import { formatTime } from '@/utils/date';
import { Switch } from '@/components/atoms/switch';

const Page = () => {
  const router = useRouter();

  // data listing
  const [listProps, setListProps] = useState<getEventsProps>({
    page: 1,
    limit: 20,
  });
  const [list, getList, listLoading] = useActionState(
    (_: unknown, props: getEventsProps) => getEvents(props),
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
    (_: unknown, id: string) => deleteEvent(id),
    { message: '' }
  );

  useEffect(() => {
    if (remove.status) {
      toast[remove.status](remove.message);
      if (remove.status === 'success') _getList();
    }
  }, [remove]);

  // update active
  const [activate, putActivate, activateLoading] = useActionState(
    (_: unknown, { id, isActive }: { id: string; isActive: boolean }) =>
      updateEvent(id, { isActive }),
    { message: '' }
  );

  useEffect(() => {
    if (activate.status) {
      toast[activate.status](activate.message);
      if (activate.status === 'success') _getList();
    }
  }, [activate]);

  return (
    <div>
      <h1 className="typo-h1 mb-4 grow">Acara</h1>

      <DataTable
        loading={listLoading || removeLoading || activateLoading}
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
            <Link href={'acara/tambah'}>
              <PlusIcon />
              Baru
            </Link>
          </Button>
        }
        cols={[
          {
            key: 'event',
            label: 'Acara',
            cell: ({ row }) => (
              <div>
                <p className="typo-large line-clamp-2">{row.original.title}</p>
                <small className="typo-small text-muted-foreground truncate">
                  {row.original.startDate
                    ? formatTime(row.original.startDate, 'DD MMM YYYY')
                    : ''}
                  {row.original.endDate
                    ? ' s.d. ' + formatTime(row.original.endDate, 'DD MMM YYYY')
                    : ''}
                </small>
              </div>
            ),
          },
          {
            key: 'isActive',
            label: 'Aktif',
            cell: ({ row }) => (
              <Switch
                checked={row.original.isActive}
                onCheckedChange={(s) =>
                  startTransition(() =>
                    putActivate({ id: row.original.id, isActive: s })
                  )
                }
              />
            ),
          },
          {
            key: 'location',
            label: 'Lokasi',
            cell: ({ row }) => (
              <p className="text-p line-clamp-2">{row.original.location}</p>
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
            icon: UsersIcon,
            label: 'Audiens',
            onClick: (data) => {
              router.push(`acara/${data.id}/audiens`);
            },
          },
          {
            icon: FileTextIcon,
            label: 'Formulir',
            onClick: (data) => {
              router.push(`acara/${data.id}/formulir`);
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
