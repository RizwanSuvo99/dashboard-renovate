import { NextResponse } from 'next/server';
import { z } from 'zod';
import { themeRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

const ThemeSchema = z.object({
  mode: z.enum(['light', 'dark', 'system']),
  presetId: z.enum(['emerald', 'slate', 'rose', 'ocean']),
  radius: z.enum(['sm', 'md', 'lg']),
  fontFamilyId: z.enum(['inter', 'geist', 'sora', 'system']),
  sidebar: z.enum(['compact', 'expanded', 'floating']),
  brandName: z.string().min(1).max(40),
});

export async function GET() {
  return NextResponse.json(await themeRepo.get());
}

export async function PUT(req: Request) {
  const user = await requireRole('admin');
  const body = await req.json();
  const parsed = ThemeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const next = await themeRepo.set(parsed.data);
  await logActivity(user, 'updated_theme', 'theme');
  return NextResponse.json(next);
}
