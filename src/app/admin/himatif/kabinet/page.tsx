import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table';
import { Card } from '@/components/atoms/card';
import ActionResponseAlert from '@/components/molecules/action-response-alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { getInitials } from '@/utils/string';
import PaginationBar from '@/components/molecules/pagination-bar';
import { Button } from '@/components/atoms/button';
import { Edit2Icon, PlusIcon, SearchIcon, Trash2Icon } from 'lucide-react';
import { Input } from '@/components/atoms/input';
import Link from 'next/link';
import { getCabinets } from './actions';

interface Props {
  searchParams?: Promise<{
    search: string;
    page: number;
    limit: number;
  }>;
}

const Page = async ({ searchParams }: Props) => {
  const { search = '', page = 1, limit = 10 } = (await searchParams) ?? {};

  const { data, count, error } = await getCabinets({
    search: search,
    page: page,
    limit: limit,
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="typo-h1 grow">Kabinet</h1>
        <Button asChild>
          <Link href={'kabinet/tambah'}>
            <PlusIcon />
            Baru
          </Link>
        </Button>
      </div>

      <ActionResponseAlert error={error} className="mb-4" />

      <form className="mb-4 flex flex-wrap gap-2">
        <div>
          <Input
            type="text"
            name="search"
            placeholder="Cari..."
            defaultValue={search}
          />
        </div>
        <Button type="submit" variant={'outline'} size={'icon'}>
          <SearchIcon />
        </Button>
      </form>

      <Card className="mb-4 p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>User</TableHead>
              <TableHead>Divisi</TableHead>
              <TableHead>Program kerja</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((dat, i) => (
              <TableRow key={i}>
                <TableCell></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={dat.logo ?? ''} alt={dat.name ?? ''} />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(dat.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{dat.name}</span>
                      {dat.isActive && (
                        <span className="typo-small text-green-500">AKTIF</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-p">{dat._count.divisions}</p>
                </TableCell>
                <TableCell>
                  <p className="text-p">{dat._count.programs}</p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant={'outline'} size={'icon'} asChild>
                      <Link href={`users/${dat.id}`}>
                        <Edit2Icon />
                      </Link>
                    </Button>
                    <Button variant={'outline'} size={'icon'}>
                      <Trash2Icon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <PaginationBar count={count} page={page} limit={limit} />
    </div>
  );
};

export default Page;
