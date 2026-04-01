import { NextResponse } from 'next/server';
import { orderRepo } from '@/lib/repositories';
import { requireUser } from '@/lib/auth';

export async function GET() {
  await requireUser();
  return NextResponse.json(await orderRepo.list());
}
