'use client';

import { Button } from '@/components/atoms/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { ListTile, ListTileItem } from '@/components/molecules/list-tile';
import { signOut } from 'next-auth/react';

const Page = () => {
  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <ListTile>
            <ListTileItem
              title="Logout"
              subtitle="Keluar dari akun"
              slotRight={
                <Button
                  variant={'destructive'}
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Logout
                </Button>
              }
            />
          </ListTile>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
