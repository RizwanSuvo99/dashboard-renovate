import { NextResponse } from 'next/server';
import { customerRepo } from '@/lib/repositories';
import { requireUser } from '@/lib/auth';

export async function GET() {
  await requireUser();
  return NextResponse.json(await customerRepo.list());
}
