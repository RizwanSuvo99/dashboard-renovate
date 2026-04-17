import { NextResponse } from 'next/server';
import { z } from 'zod';
import { pageRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

const PatchSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(1).optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  layout: z.enum(['standard', 'wide', 'split']).optional(),
  widgets: z.array(z.object({
    id: z.string(),
    type: z.string(),
    config: z.record(z.unknown()),
    span: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(6), z.literal(12)]).optional(),
  })).optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const page = await pageRepo.findById(params.id);
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await requireRole(['admin', 'editor']);
  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const page = await pageRepo.update(params.id, { ...parsed.data, updatedAt: new Date().toISOString() });
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await logActivity(user, 'updated_page', page.title);
  return NextResponse.json(page);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireRole('admin');
  const page = await pageRepo.findById(params.id);
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await pageRepo.delete(params.id);
  await logActivity(user, 'deleted_page', page.title);
  return NextResponse.json({ ok: true });
}
