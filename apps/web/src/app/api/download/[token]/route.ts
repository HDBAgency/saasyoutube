import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@saasyoutube/db';
import { verifyDownloadToken } from '@/lib/jwt';

const WORKER_HOST = process.env.WORKER_INTERNAL_HOST ?? 'worker.railway.internal';
const WORKER_PORT = process.env.FILE_SERVER_PORT ?? '3001';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } },
) {
  const payload = verifyDownloadToken(params.token);
  if (!payload) {
    return NextResponse.json({ error: 'Token invalide ou expiré.' }, { status: 401 });
  }

  const job = await prisma.job.findUnique({ where: { id: payload.jobId } });
  if (!job || job.status !== 'done') {
    return NextResponse.json({ error: 'Fichier introuvable.' }, { status: 404 });
  }

  try {
    await prisma.download.create({
      data: {
        jobId: job.id,
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
      },
    });

    const workerUrl = `http://${WORKER_HOST}:${WORKER_PORT}/download/${job.id}`;
    const workerRes = await fetch(workerUrl);

    if (!workerRes.ok) {
      return NextResponse.json({ error: 'Le fichier a expiré.' }, { status: 410 });
    }

    const headers = new Headers();
    headers.set('Content-Disposition', workerRes.headers.get('Content-Disposition') ?? 'attachment');
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Cache-Control', 'no-store');
    const cl = workerRes.headers.get('Content-Length');
    if (cl) headers.set('Content-Length', cl);

    return new NextResponse(workerRes.body, { headers });
  } catch (err) {
    console.error('[download]', err);
    return NextResponse.json({ error: 'Erreur lors du téléchargement.' }, { status: 500 });
  }
}
