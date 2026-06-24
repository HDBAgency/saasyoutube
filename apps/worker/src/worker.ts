import 'dotenv/config';
import { Worker, type Job } from 'bullmq';

process.on('uncaughtException', (err) => { console.error('[worker] CRASH uncaughtException:', err); process.exit(1); });
process.on('unhandledRejection', (reason) => { console.error('[worker] CRASH unhandledRejection:', reason); process.exit(1); });
import { execFile, exec } from 'child_process';
import { promisify } from 'util';
import { mkdir, rm, readdir, stat } from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import http from 'http';
import path from 'path';
import jwt from 'jsonwebtoken';
import { prisma } from '@saasyoutube/db';

const execFileAsync = promisify(execFile);
const execAsync = promisify(exec);
const YTDLP = process.platform === 'win32' ? 'python -m yt_dlp' : 'yt-dlp';

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

function parseRedisUrl(url: string) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname || 'localhost',
      port: parseInt(u.port || '6379'),
      password: u.password || undefined,
      username: u.username || undefined,
      tls: u.protocol === 'rediss:' ? {} : undefined,
      maxRetriesPerRequest: null as null,
    };
  } catch {
    return { host: 'localhost', port: 6379, maxRetriesPerRequest: null as null };
  }
}
const TMP_DIR = process.env.TMP_DIR ?? (process.platform === 'win32' ? 'C:\\temp\\downloads' : '/tmp/downloads');
const JWT_SECRET = process.env.JWT_SECRET ?? 'fallback_secret_change_me';
const MAX_DURATION = parseInt(process.env.MAX_VIDEO_DURATION_SECONDS ?? '3600');
const EXPIRY_MINUTES = parseInt(process.env.DOWNLOAD_EXPIRY_MINUTES ?? '30');

const FORMAT_CONFIG: Record<string, string[]> = {
  'mp3':      ['-x', '--audio-format', 'mp3', '--audio-quality', '128K'],
  'mp3-hd':   ['-x', '--audio-format', 'mp3', '--audio-quality', '0'],
  'mp4-360p': ['-f', 'best[height<=360]/best', '--merge-output-format', 'mp4'],
  'mp4-720p': ['-f', 'best[height<=720]/best', '--merge-output-format', 'mp4'],
  'mp4-1080p':['-f', 'best[height<=1080]/best', '--merge-output-format', 'mp4'],
  'm4a':      ['-x', '--audio-format', 'm4a'],
  'wav':      ['-x', '--audio-format', 'wav'],
};

async function updateProgress(jobId: string, progress: number) {
  await prisma.job.update({ where: { id: jobId }, data: { progress } });
}

async function processConversion(job: Job) {
  const { jobId, url, format, title } = job.data as { jobId: string; url: string; format: string; title?: string };
  const jobDir = path.join(TMP_DIR, jobId);

  await prisma.job.update({ where: { id: jobId }, data: { status: 'processing', progress: 5 } });
  await mkdir(jobDir, { recursive: true });

  const formatArgs = FORMAT_CONFIG[format];
  if (!formatArgs) throw new Error(`Format inconnu: ${format}`);

  await updateProgress(jobId, 10);
  await job.updateProgress(10);

  const outputTemplate = path.join(jobDir, 'output.%(ext)s');
  const isYoutube = /youtu\.?be/.test(url);
  const extractorArgs: string[] = isYoutube
    ? ['--extractor-args', 'youtube:player_client=tv_embedded,ios,android']
    : [];

  const ytdlpArgs = [
    '--no-playlist',
    '--no-warnings',
    ...extractorArgs,
    '--ffmpeg-location', 'ffmpeg',
    '-o', outputTemplate,
    ...formatArgs,
    url,
  ];

  const ytdlpCmd = `${YTDLP} ${ytdlpArgs.map(a => `"${a}"`).join(' ')}`;
  await execAsync(ytdlpCmd, { timeout: 300_000 });

  await updateProgress(jobId, 85);
  await job.updateProgress(85);

  const EXT_MAP: Record<string, string> = {
    'mp3': 'mp3', 'mp3-hd': 'mp3', 'm4a': 'm4a', 'wav': 'wav',
    'mp4-360p': 'mp4', 'mp4-720p': 'mp4', 'mp4-1080p': 'mp4',
  };
  const expectedExt = EXT_MAP[format];
  const files = await readdir(jobDir);
  if (files.length === 0) throw new Error('Aucun fichier généré.');
  const target = files.find(f => f.endsWith(`.${expectedExt}`) && !f.endsWith('.part')) ?? files[0];
  const rawPath = path.join(jobDir, target);

  // Rename to video title
  const safeTitle = (title ?? 'video').replace(/[<>:"/\\|?*]/g, '').trim().slice(0, 100);
  const finalName = `${safeTitle}.${expectedExt}`;
  const filePath = path.join(jobDir, finalName);
  const { rename } = await import('fs/promises');
  if (rawPath !== filePath) await rename(rawPath, filePath);
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60_000);
  const token = jwt.sign({ jobId, filePath }, JWT_SECRET, {
    expiresIn: `${EXPIRY_MINUTES}m`,
  });

  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'done', progress: 100, filePath, token, expiresAt },
  });

  // Auto-cleanup after expiry
  setTimeout(async () => {
    try {
      await rm(jobDir, { recursive: true, force: true });
      await prisma.job.updateMany({
        where: { id: jobId, filePath: { not: null } },
        data: { filePath: null },
      });
    } catch {}
  }, EXPIRY_MINUTES * 60_000);
}

const connection = parseRedisUrl(REDIS_URL);

const worker = new Worker(
  'conversions',
  async (job: Job) => {
    try {
      await processConversion(job);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      await prisma.job.update({
        where: { id: job.data.jobId },
        data: { status: 'error', errorMsg: msg },
      });
      throw err;
    }
  },
  { connection, concurrency: 3 },
);

worker.on('completed', (job) => console.log(`[worker] Job ${job.id} terminé.`));
worker.on('failed', (job, err) => console.error(`[worker] Job ${job?.id} échoué:`, err.message));

// Serveur HTTP interne pour servir les fichiers au service web
const FILE_SERVER_PORT = parseInt(process.env.FILE_SERVER_PORT ?? '3001');
const fileServer = http.createServer(async (req, res) => {
  const jobId = req.url?.replace('/download/', '').replace('/', '');
  if (!jobId) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job?.filePath || !existsSync(job.filePath)) {
      res.writeHead(410); res.end('Expired'); return;
    }
    const fileStat = await stat(job.filePath);
    const fileName = path.basename(job.filePath);
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(fileStat.size),
    });
    createReadStream(job.filePath).pipe(res);
  } catch { res.writeHead(500); res.end('Error'); }
});
fileServer.listen(FILE_SERVER_PORT, () => console.log(`[worker] File server :${FILE_SERVER_PORT}`));

console.log('[worker] v2 Démarré — en attente de jobs...');
