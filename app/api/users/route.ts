import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { userRepo } from '@/lib/repositories';
import { getCurrentUser, requireRole } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function GET() {
  await requireRole('admin');
  const users = await userRepo.list({ sort: { field: 'createdAt', dir: 'desc' } });
  return NextResponse.json(
    users.map(({ passwordHash: _ph, ...rest }) => rest),
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const existing = (await userRepo.list()).find(
    (u) => u.email.toLowerCase() === parsed.data.email.toLowerCase(),
  );
  if (existing) {
    return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const requester = await getCurrentUser();
  // Self-register defaults to viewer; only admins can promote.
  const role = requester?.role === 'admin' ? 'editor' : 'viewer';
  const now = new Date().toISOString();

  const user = await userRepo.create({
    email: parsed.data.email,
    name: parsed.data.name,
    role,
    passwordHash,
    avatarUrl: null,
    active: true,
    createdAt: now,
    updatedAt: now,
  });

  if (requester) await logActivity(requester, 'created_user', user.email);

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role });
}
