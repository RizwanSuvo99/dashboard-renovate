'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { NavItem } from '@/types';
import { Tooltip, TooltipProvider } from '@/components/molecules/Tooltip';

export interface SidebarProps {
  brandName: string;
  items: NavItem[];
  variant?: 'compact' | 'expanded' | 'floating';
}

const iconFor = (name?: string): React.ReactNode => {
  if (!name) return <Icons.Square size={16} />;
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, '');
  const Component = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[cleaned];
  if (!Component) return <Icons.Square size={16} />;
  return <Component size={16} />;
};

export function Sidebar({ brandName, items, variant = 'expanded' }: SidebarProps) {
  const pathname = usePathname();
  const isCompact = variant === 'compact';

  const groups = React.useMemo(() => {
    const map = new Map<string, NavItem[]>();
    for (const it of items) {
      const g = it.group ?? 'main';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(it);
    }
    for (const arr of map.values()) arr.sort((a, b) => a.order - b.order);
    return map;
  }, [items]);

  const labels: Record<string, string> = {
    main: 'Workspace',
    workspace: 'Workspace',
    admin: 'Admin',
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'flex h-full flex-col border-border bg-surface text-fg',
          variant === 'expanded' && 'w-60 border-r',
          variant === 'compact' && 'w-16 border-r items-center',
          variant === 'floating' && 'mx-3 my-3 w-60 rounded-xl border shadow-sm',
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2 px-4 py-4',
            isCompact && 'justify-center px-0',
          )}
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-fg font-display font-semibold">
            {brandName[0]}
          </span>
          {!isCompact && (
            <span className="font-display text-md font-semibold tracking-tight">{brandName}</span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-2">
          {[...groups.entries()].map(([group, navItems]) => (
            <div key={group} className="mb-4">
              {!isCompact && (
                <p className="mb-1 px-2 text-2xs font-semibold uppercase tracking-wider text-fg-subtle">
                  {labels[group] ?? group}
                </p>
              )}
              <ul className="space-y-0.5">
                {navItems.map((item) => {
                  const active =
                    item.href &&
                    (pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(item.href + '/')));
                  const linkInner = (
                    <>
                      <span className={cn('shrink-0', active ? 'text-primary' : 'text-fg-subtle')}>
                        {iconFor(item.icon)}
                      </span>
                      {!isCompact && <span className="truncate">{item.label}</span>}
                    </>
                  );
                  const link = (
                    <Link
                      href={item.href ?? '#'}
                      className={cn(
                        'group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                        active
                          ? 'bg-primary-soft text-fg font-medium'
                          : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
                        isCompact && 'justify-center px-0 h-9 w-9',
                      )}
                    >
                      {linkInner}
                    </Link>
                  );
                  return (
                    <li key={item.id}>
                      {isCompact ? (
                        <Tooltip content={item.label} side="right">
                          {link}
                        </Tooltip>
                      ) : (
                        link
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {!isCompact && (
          <div className="border-t border-border p-3 text-xs text-fg-subtle">
            <p className="font-medium text-fg-muted">{brandName} Admin</p>
            <p>v0.1 · {new Date().getFullYear()}</p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
