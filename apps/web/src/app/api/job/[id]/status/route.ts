import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@saasyoutube/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    select: { status: true, progress: true, token: true, errorMsg: true },
  });

  if (!job) {
    return NextResponse.json({ error: 'Job introuvable.' }, { status: 404 });
  }

  return NextResponse.json({
    status: job.status,
    progress: job.progress,
    downloadToken: job.status === 'done' ? job.token : undefined,
    error: job.errorMsg ?? undefined,
  });
}
