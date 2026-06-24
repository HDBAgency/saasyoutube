import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { detectPlatform, validateUrl } from '@/lib/utils';
import { rateLimiter } from '@/lib/rateLimit';
import type { OutputFormat } from '@saasyoutube/shared';

const execAsync = promisify(exec);

const YTDLP = process.platform === 'win32' ? 'python -m yt_dlp' : 'yt-dlp';

async function getCookiesArg(): Promise<string> {
  const cookies = process.env.YOUTUBE_COOKIES;
  if (!cookies) return '';
  const { writeFile } = await import('fs/promises');
  const path = '/tmp/yt-cookies.txt';
  await writeFile(path, cookies, 'utf8');
  return `--cookies ${path}`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!rateLimiter.check(`analyze:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes. Attendez 1 minute.' }, { status: 429 });
  }

  let url: string;
  try {
    ({ url } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 });
  }

  if (!url || typeof url !== 'string' || !validateUrl(url)) {
    return NextResponse.json({ error: 'URL non supportée.' }, { status: 400 });
  }

  const platform = detectPlatform(url);

  try {
    const cookiesArg = await getCookiesArg();
    const { stdout } = await execAsync(
      `${YTDLP} --dump-json --no-playlist --no-warnings ${cookiesArg} "${url}"`,
      { timeout: 30_000 },
    );

    const info = JSON.parse(stdout);

    const formats: OutputFormat[] = ['mp3', 'mp3-hd', 'm4a', 'wav', 'mp4-360p', 'mp4-720p', 'mp4-1080p'];

    return NextResponse.json({
      title: info.title ?? 'Vidéo sans titre',
      thumbnail: info.thumbnail ?? '',
      duration: info.duration ?? 0,
      platform,
      formats,
    });
  } catch (err) {
    console.error('[analyze]', err);
    return NextResponse.json(
      { error: "Impossible d'analyser cette URL. Vérifiez qu'elle est publique." },
      { status: 500 },
    );
  }
}
