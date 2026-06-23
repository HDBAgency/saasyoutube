import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@saasyoutube/db';
import { verifyDownloadToken } from '@/lib/jwt';
import { createReadStream, existsSync } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } },
) {
  const payload = verifyDownloadToken(params.token);
  if (!payload) {
    return NextResponse.json({ error: 'Token invalide ou expiré.' }, { status: 401 });
  }

  const job = await prisma.job.findUnique({ where: { id: payload.jobId } });
  if (!job || job.status !== 'done' || !job.filePath) {
    return NextResponse.json({ error: 'Fichier introuvable.' }, { status: 404 });
  }

  if (!existsSync(job.filePath)) {
    return NextResponse.json({ error: 'Le fichier a expiré.' }, { status: 410 });
  }

  try {
    const fileStat = await stat(job.filePath);
    const fileName = path.basename(job.filePath);

    await prisma.download.create({
      data: {
        jobId: job.id,
        ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown',
      },
    });

    const stream = createReadStream(job.filePath);

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': String(fileStat.size),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[download]', err);
    return NextResponse.json({ error: 'Erreur lors du téléchargement.' }, { status: 500 });
  }
}
