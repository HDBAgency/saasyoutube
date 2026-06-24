import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { detectPlatform, validateUrl } from '@/lib/utils';
import { rateLimiter } from '@/lib/rateLimit';
import type { OutputFormat } from '@saasyoutube/shared';

const execAsync = promisify(exec);
const YTDLP = process.platform === 'win32' ? 'python -m yt_dlp' : 'yt-dlp';

const FORMATS: OutputFormat[] = ['mp3', 'mp3-hd', 'm4a', 'wav', 'mp4-360p', 'mp4-720p', 'mp4-1080p'];

async function analyzeYoutube(url: string) {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(oembedUrl);
  if (!res.ok) throw new Error(`oEmbed ${res.status}`);
  const data = await res.json() as { title: string; thumbnail_url: string };
  return { title: data.title, thumbnail: data.thumbnail_url, duration: 0 };
}

async function getCookiesArg(): Promise<string> {
  const b64 = process.env.YOUTUBE_COOKIES_B64;
  if (!b64) return '';
  const { writeFile } = await import('fs/promises');
  const cookies = Buffer.from(b64, 'base64').toString('utf8');
  const cookiePath = '/tmp/yt-cookies.txt';
  await writeFile(cookiePath, cookies, 'utf8');
  return `--cookies ${cookiePath}`;
}

async function analyzeWithYtdlp(url: string) {
  const cookiesArg = await getCookiesArg();
  const { stdout } = await execAsync(
    `${YTDLP} --print "%(title)s\n%(thumbnail)s\n%(duration)s" --no-playlist --no-warnings --no-check-formats ${cookiesArg} "${url}"`,
    { timeout: 30_000 },
  );
  const [title, thumbnail, durationStr] = stdout.trim().split('\n');
  return { title: title || 'Vidéo sans titre', thumbnail: thumbnail || '', duration: parseFloat(durationStr) || 0 };
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
    const info = platform === 'youtube'
      ? await analyzeYoutube(url)
      : await analyzeWithYtdlp(url);

    return NextResponse.json({ ...info, platform, formats: FORMATS });
  } catch (err) {
    console.error('[analyze]', err);
    return NextResponse.json(
      { error: "Impossible d'analyser cette URL. Vérifiez qu'elle est publique." },
      { status: 500 },
    );
  }
}
