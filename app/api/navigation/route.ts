import { NextResponse } from 'next/server';
import { z } from 'zod';
import { navigationRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import type { NavItem } from '@/types';

const ItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  icon: z.string().optional(),
  href: z.string().optional(),
  parentId: z.string().nullable().optional(),
  order: z.number().int().nonnegative(),
  group: z.enum(['main', 'admin', 'workspace']).optional(),
});

export async function GET() {
  return NextResponse.json(await navigationRepo.list());
}

/** Replace the entire navigation array — used by the navigation builder. */
export async function PUT(req: Request) {
  const user = await requireRole('admin');
  const body = await req.json();
  const parsed = z.array(ItemSchema).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const current = await navigationRepo.list();
  for (const item of current) await navigationRepo.delete(item.id);
  const created: NavItem[] = [];
  for (const next of parsed.data) {
    created.push(await navigationRepo.create(next));
  }
  await logActivity(user, 'updated_navigation', 'sidebar');
  return NextResponse.json(created);
}
