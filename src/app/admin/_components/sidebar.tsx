'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/atoms/sidebar';
import BrandLogo from '@/components/molecules/brand-logo';
import { ChevronRightIcon, LucideIcon, UsersIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/atoms/collapsible';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Building2Icon,
  CalendarDaysIcon,
  ClipboardListIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  MegaphoneIcon,
  NetworkIcon,
  TicketIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { useSession } from 'next-auth/react';
import { getInitials } from '@/utils/string';

interface Menu {
  title: string;
  url: string;
  group?: string;
  roles?: string[];
  icon?: LucideIcon;
  children?: Menu[];
}

const Menu: Menu[] = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboardIcon,
  },
  {
    group: 'himatif',
    title: 'Kabinet',
    url: '/admin/himatif/kabinet',
    roles: ['ADMIN', 'SUPERADMIN'],
    icon: Building2Icon,
  },
  {
    group: 'himatif',
    title: 'Divisi',
    url: '/admin/himatif/divisi',
    roles: ['ADMIN', 'SUPERADMIN'],
    icon: NetworkIcon,
  },
  {
    group: 'himatif',
    title: 'Program kerja',
    url: '/admin/himatif/program-kerja',
    roles: ['ADMIN', 'SUPERADMIN'],
    icon: ClipboardListIcon,
  },
  {
    group: 'agenda',
    title: 'Kalendar',
    url: '/admin/agenda/kalendar',
    roles: ['ADMIN', 'SUPERADMIN'],
    icon: CalendarDaysIcon,
  },
  {
    group: 'agenda',
    title: 'Acara',
    url: '/admin/agenda/acara',
    roles: ['ADMIN', 'SUPERADMIN'],
    icon: TicketIcon,
  },
  {
    group: 'agenda',
    title: 'Siaran',
    url: '/admin/agenda/siaran',
    roles: ['ADMIN', 'SUPERADMIN'],
    icon: MegaphoneIcon,
  },
  {
    group: 'belajar',
    title: 'Materi belajar',
    url: '/admin/belajar/materi-belajar',
    roles: ['ADMIN', 'SUPERADMIN'],
    icon: LibraryIcon,
  },
  {
    group: 'formulir',
    title: 'Formulir',
    url: '/admin/formulir/formulir',
    roles: ['ADMIN', 'SUPERADMIN'],
    icon: FileTextIcon,
  },
  {
    group: 'iam',
    title: 'Users',
    url: '/admin/iam/users',
    roles: ['SUPERADMIN'],
    icon: UsersIcon,
  },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const visibleMenu = React.useMemo(
    () =>
      Menu.reduce<Record<string, Menu[]>>((ac, cu) => {
        if (cu.roles?.length && !cu.roles.includes(session?.user.role ?? ''))
          return ac;

        if (cu.group) {
          if (cu.group in ac) ac[cu.group].push(cu);
          else ac[cu.group] = [cu];
        } else {
          if ('root' in ac) ac['root'].push(cu);
          else ac['root'] = [cu];
        }
        return ac;
      }, {}),
    [session]
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <BrandLogo />
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(visibleMenu).map(([label, menu]) => (
          <SidebarGroup key={label}>
            <SidebarGroupLabel className="capitalize">
              {label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {menu.map((menuItem, i) => (
                <MenuItem key={i} item={menuItem} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={session?.user.image ?? ''}
                alt={session?.user.name ?? ''}
              />
              <AvatarFallback className="rounded-lg">
                {getInitials(session?.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session?.user.name}</span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

const MenuItem = ({ item }: { item: Menu }) => {
  const pathname = usePathname();

  if (item.children?.length) {
    return (
      <Collapsible asChild className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children?.map((subItem, i) => (
                <MenuItem key={i} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  const isActive = pathname == item.url;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton data-active={isActive} asChild>
        <Link href={item.url ?? '#'}>
          {item.icon && <item.icon />}
          <p>{item.title}</p>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
};
