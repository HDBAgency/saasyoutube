import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@saasyoutube/db';
import { addConversionJob } from '@/lib/queue';
import { detectPlatform, validateUrl } from '@/lib/utils';
import { rateLimiter } from '@/lib/rateLimit';
import { getSession } from '@/lib/session';

const FREE_DAILY_LIMIT = 2;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!rateLimiter.check(`convert:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes.' }, { status: 429 });
  }

  // Check premium session
  const session = getSession();
  const isPremium = session?.plan === 'premium';

  if (!isPremium) {
    // Daily limit check per IP for free users
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await prisma.job.count({
      where: {
        ipAddress: ip,
        createdAt: { gte: startOfDay },
        status: { not: 'error' },
      },
    });

    if (todayCount >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: `Limite atteinte : ${FREE_DAILY_LIMIT} téléchargements gratuits par jour. Passez Premium pour un accès illimité.`,
          limitReached: true,
        },
        { status: 403 },
      );
    }
  }

  let url: string, format: string, title: string;
  try {
    ({ url, format, title } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  if (!url || !format || !validateUrl(url)) {
    return NextResponse.json({ error: 'Paramètres invalides.' }, { status: 400 });
  }

  const validFormats = ['mp3', 'mp3-hd', 'mp4-360p', 'mp4-720p', 'mp4-1080p', 'm4a', 'wav'];
  if (!validFormats.includes(format)) {
    return NextResponse.json({ error: 'Format non supporté.' }, { status: 400 });
  }

  const premiumFormats = ['mp3-hd', 'mp4-1080p'];
  if (premiumFormats.includes(format) && !isPremium) {
    return NextResponse.json(
      { error: 'Ce format est réservé aux abonnés Premium.', premiumRequired: true },
      { status: 403 },
    );
  }

  const platform = detectPlatform(url);

  const job = await prisma.job.create({
    data: {
      url,
      title: title ?? null,
      platform,
      format,
      ipAddress: ip,
      userEmail: session?.email ?? null,
    },
  });

  await addConversionJob({ jobId: job.id, url, format, title: job.title ?? '' });

  return NextResponse.json({ jobId: job.id });
}
