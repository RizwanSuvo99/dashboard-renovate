import { NextResponse } from 'next/server';
import { z } from 'zod';
import { pageRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

const WidgetInstanceSchema = z.object({
  id: z.string(),
  type: z.string(),
  config: z.record(z.unknown()),
  span: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(6), z.literal(12)]).optional(),
});

const PageSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'lowercase, numbers, dashes only'),
  title: z.string().min(1),
  icon: z.string().optional(),
  description: z.string().optional(),
  layout: z.enum(['standard', 'wide', 'split']).default('standard'),
  widgets: z.array(WidgetInstanceSchema).default([]),
});

export async function GET() {
  return NextResponse.json(await pageRepo.list({ sort: { field: 'updatedAt', dir: 'desc' } }));
}

export async function POST(req: Request) {
  const user = await requireRole(['admin', 'editor']);
  const body = await req.json();
  const parsed = PageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const all = await pageRepo.list();
  const collision = all.find((p) => p.slug === parsed.data.slug);
  if (collision) return NextResponse.json({ error: 'Slug already in use.' }, { status: 409 });

  const now = new Date().toISOString();
  const page = await pageRepo.create({
    slug: parsed.data.slug,
    title: parsed.data.title,
    icon: parsed.data.icon,
    description: parsed.data.description,
    layout: parsed.data.layout,
    widgets: parsed.data.widgets,
    createdAt: now,
    updatedAt: now,
    authorId: user.id,
  });
  await logActivity(user, 'created_page', page.title);
  return NextResponse.json(page);
}
