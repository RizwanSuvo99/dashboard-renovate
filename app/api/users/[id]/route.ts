import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { userRepo } from '@/lib/repositories';
import { requireRole } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

const PatchSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
  active: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const requester = await requireRole('admin');
  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const patch: Record<string, unknown> = { ...parsed.data, updatedAt: new Date().toISOString() };
  if (parsed.data.password) {
    patch.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    delete patch.password;
  }
  const user = await userRepo.update(params.id, patch);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await logActivity(requester, 'updated_user', user.email);
  const { passwordHash: _ph, ...rest } = user;
  return NextResponse.json(rest);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const requester = await requireRole('admin');
  const user = await userRepo.findById(params.id);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (user.id === requester.id) return NextResponse.json({ error: "You can't delete yourself." }, { status: 400 });
  await userRepo.delete(params.id);
  await logActivity(requester, 'deleted_user', user.email);
  return NextResponse.json({ ok: true });
}
