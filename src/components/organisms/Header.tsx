'use client';
import * as React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Bell, ChevronDown, LogOut, Moon, Search, Settings, Sun, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { SearchBar } from '@/components/molecules/SearchBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/molecules/DropdownMenu';
import { useTheme } from '@/hooks/useTheme';

export interface HeaderProps {
  user: { name: string; email: string; role: string; avatarUrl?: string | null };
  unreadNotifications?: number;
  pageTitle?: string;
  pageDescription?: string;
}

export function Header({ user, unreadNotifications = 0, pageTitle, pageDescription }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = React.useState('');

  const toggleMode = () => {
    const next = theme.mode === 'dark' ? 'light' : 'dark';
    setTheme({ ...theme, mode: next });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur lg:px-6">
      <div className="flex flex-1 items-center gap-3">
        {pageTitle && (
          <div className="hidden md:block">
            <h1 className="font-display text-md font-semibold tracking-tight text-fg">{pageTitle}</h1>
            {pageDescription && <p className="text-xs text-fg-subtle">{pageDescription}</p>}
          </div>
        )}
        <div className="ml-auto md:ml-6 md:max-w-sm md:flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search anything…" showHint />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleMode}
          className="text-fg-muted"
        >
          {theme.mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        <Link
          href="/notifications"
          aria-label={`Notifications (${unreadNotifications} unread)`}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg"
        >
          <Bell size={16} />
          {unreadNotifications > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-2xs font-semibold text-white">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-1 inline-flex items-center gap-2 rounded-md p-1 hover:bg-surface-2"
            >
              <Avatar name={user.name} src={user.avatarUrl ?? undefined} size="sm" />
              <span className="hidden md:flex md:flex-col md:items-start md:leading-tight">
                <span className="text-sm font-medium text-fg">{user.name}</span>
                <span className="text-2xs text-fg-subtle capitalize">{user.role}</span>
              </span>
              <ChevronDown size={14} className="hidden text-fg-subtle md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-fg">{user.name}</span>
                <span className="text-2xs font-normal normal-case text-fg-subtle">{user.email}</span>
                <span className="mt-1">
                  <Badge tone="primary" size="sm">{user.role}</Badge>
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon size={14} /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings size={14} /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem danger onSelect={() => signOut({ callbackUrl: '/login' })}>
              <LogOut size={14} /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
