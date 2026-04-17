import { NextResponse } from 'next/server';
import { activityRepo } from '@/lib/repositories';
import { requireUser } from '@/lib/auth';

export async function GET() {
  await requireUser();
  return NextResponse.json(await activityRepo.list({ sort: { field: 'createdAt', dir: 'desc' } }));
}
