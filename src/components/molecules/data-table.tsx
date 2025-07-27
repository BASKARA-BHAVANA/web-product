'use client';

import {
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { ReactNode, useMemo, useState } from 'react';
import { Checkbox } from '../atoms/checkbox';
import {
  ChevronDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisIcon,
  FunnelIcon,
  FunnelXIcon,
  LoaderIcon,
  LucideIcon,
} from 'lucide-react';
import { Button } from '../atoms/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../atoms/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxes,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadios,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../atoms/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../atoms/select';
import { Separator } from '../atoms/separator';
import { Card } from '../atoms/card';
import InputSearch from './input-search';
import { cn } from '@/utils/misc';

interface FilterProps {
  type: 'search' | 'radio' | 'checkbox';
  label: string;
  value: string[] | string;
  onValueChange: (v: string[] | string) => void;
  options?: { value: string; label: string }[];
}

export interface TableDataProps<T> {
  loading?: boolean;
  data: T[];
  cols: {
    key: string;
    label: string;
    cell?: (op: CellContext<T, unknown>) => ReactNode;
    allowSort?: boolean;
  }[];
  rowActions?: {
    label: string;
    icon: LucideIcon;
    className?: string;
    onClick: (data: T) => void;
  }[];
  selectionActions?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  }[];
  pageSizes?: number[];
  pagination?: {
    index: number;
    size: number;
    count: number;
    onChange: (op: { index: number; size: number }) => void;
  };
  slotTopLeft?: ReactNode;
  slotTopRight?: ReactNode;
  filters?: FilterProps[];
}

const DataTable = <T,>({
  loading,
  data,
  cols,
  rowActions,
  selectionActions,
  pageSizes = [5, 10, 20, 50],
  pagination: paginationParams,
  slotTopLeft,
  slotTopRight,
  filters,
}: TableDataProps<T>) => {
  const columns: ColumnDef<T>[] = useMemo(() => {
    const arr: ColumnDef<T>[] = [];

    if (selectionActions?.length)
      arr.push({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    else
      arr.push({
        id: 'number',
        header: '',
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return (
            <p className="typo-p text-muted-foreground">
              {pageIndex * pageSize + row.index + 1}
            </p>
          );
        },
        enableSorting: false,
        enableHiding: false,
      });

    cols.forEach((col) =>
      arr.push({
        accessorKey: col.key,
        meta: { label: col.label },
        header: () => {
          return (
            <div className="flex gap-2 px-2">
              <p className="typo-p text-muted-foreground font-bold">
                {col.label}
              </p>
            </div>
          );
        },
        cell: col.cell
          ? col.cell
          : ({ row }) => <div className="typo-p">{row.getValue(col.key)}</div>,
      })
    );

    if (rowActions?.length)
      arr.push({
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <div className="text-muted-foreground flex gap-2 transition-all">
              {rowActions.map((act, i) => (
                <Button
                  key={i}
                  variant={'outline'}
                  size={'icon'}
                  className={act.className}
                  onClick={() => act.onClick(row.original)}
                >
                  <act.icon />
                </Button>
              ))}
            </div>
          );
        },
      });

    return arr;
  }, []);

  const [showFilters, setShowFilters] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [clientPagination, setClientPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const paginationState = paginationParams
    ? {
        pageIndex: paginationParams.index,
        pageSize: paginationParams.size,
      }
    : clientPagination;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: !!paginationParams,
    onPaginationChange: paginationParams
      ? (updaterOrValue: Parameters<OnChangeFn<PaginationState>>[0]) => {
          const next =
            typeof updaterOrValue === 'function'
              ? updaterOrValue(paginationState)
              : updaterOrValue;

          paginationParams.onChange({
            index: next.pageIndex,
            size: next.pageSize,
          });
        }
      : setClientPagination,
    pageCount: paginationParams?.count
      ? Math.ceil(paginationParams?.count / paginationParams.size)
      : 1,
    rowCount: paginationParams?.count,
    state: {
      pagination: paginationState,
      rowSelection,
    },
  });

  const rows = useMemo(() => table.getRowModel().rows, [data]);

  const renderRows = useMemo(() => {
    return rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && 'selected'}
        className="group [&>td:first-child]:ps-4 [&>td:last-child]:pe-4"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [rows]);

  const rowStartAt =
    table.getState().pagination.pageSize *
      table.getState().pagination.pageIndex +
    1;

  const rowEndAt =
    table.getState().pagination.pageSize *
    (table.getState().pagination.pageIndex + 1);

  const totalRows = table.getRowCount();

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex grow flex-wrap items-center gap-2">
          {filters?.length && (
            <Button
              onClick={() => setShowFilters((s) => !s)}
              variant={'outline'}
              size={'icon'}
            >
              {showFilters ? <FunnelXIcon /> : <FunnelIcon />}
            </Button>
          )}
          {slotTopLeft}
        </div>
        <div className="flex flex-wrap items-center gap-2">{slotTopRight}</div>
      </div>
      {showFilters && (
        <>
          <Separator className="mb-4" />
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {filters?.map((filter, i) => {
              if (filter.type == 'search') {
                return (
                  <InputSearch
                    key={i}
                    placeholder={filter.label}
                    onEnter={(v) => filter.onValueChange(v)}
                  />
                );
              } else if (filter.type == 'checkbox') {
                return (
                  <DropdownMenu key={i}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={loading}
                        variant={'outline'}
                        size={'sm'}
                      >
                        {filter.label} (
                        {filter.options?.filter(({ value }) =>
                          filter.value.includes(value)
                        ).length ?? 0}
                        )
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuCheckboxes
                        values={filter.value as string[]}
                        onValuesChange={filter.onValueChange}
                        options={filter.options ?? []}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              } else if (filter.type == 'radio') {
                return (
                  <DropdownMenu key={i}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={loading}
                        variant={'outline'}
                        size={'sm'}
                      >
                        {filter.label} <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadios
                        value={filter.value as string}
                        onValueChange={filter.onValueChange}
                        options={filter.options ?? []}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
            })}
          </div>
        </>
      )}
      <Card className={cn('relative mb-4 py-2', loading ? 'min-h-24' : '')}>
        {loading && (
          <div className="bg-background/60 absolute top-0 left-0 z-10 flex h-full w-full">
            <div className="bg-primary border-primary-foreground m-auto flex items-center gap-3 rounded-lg border p-3">
              <LoaderIcon className="text-primary-foreground animate-spin" />
              <p className="typo-p">Loading...</p>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {renderRows}
            {!rows.length && !loading && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {selectionActions?.length && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={table.getFilteredSelectedRowModel().rows.length <= 0}
                variant={'ghost'}
                size={'icon'}
              >
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {table.getFilteredSelectedRowModel().rows.length} dari{' '}
                {table.getFilteredRowModel().rows.length} data
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {selectionActions.map((act, i) => (
                <DropdownMenuItem key={i} onClick={act.onClick}>
                  <act.icon />
                  {act.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <p className="typo-small text-muted-foreground grow">
          {rowStartAt} - {Math.min(totalRows, rowEndAt)} dari {totalRows}
        </p>

        <div className="flex items-center space-x-2">
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(val) => table.setPageSize(+val)}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size, i) => (
                <SelectItem value={size.toString()} key={i}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <small className="typo-small text-muted-foreground">
            Per halaman
          </small>
        </div>

        <Separator orientation="vertical" className="mx-2 me-4 !h-8" />

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          <Select
            value={table.getState().pagination.pageIndex.toString()}
            onValueChange={(val) => table.setPageIndex(+val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: table.getPageCount() }).map((_, i) => (
                <SelectItem value={i.toString()} key={i}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
