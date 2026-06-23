import { Queue } from 'bullmq';

function parseRedisUrl(url: string) {
  try {
    const u = new URL(url);
    return {
      host: u.hostname || 'localhost',
      port: parseInt(u.port || '6379'),
      password: u.password || undefined,
      username: u.username || undefined,
      tls: u.protocol === 'rediss:' ? {} : undefined,
    };
  } catch {
    return { host: 'localhost', port: 6379 };
  }
}

const connectionOptions = parseRedisUrl(
  process.env.REDIS_URL ?? 'redis://localhost:6379',
);

let conversionQueue: Queue | null = null;

export function getQueue(): Queue {
  if (!conversionQueue) {
    conversionQueue = new Queue('conversions', { connection: connectionOptions });
  }
  return conversionQueue;
}

export async function addConversionJob(data: {
  jobId: string;
  url: string;
  format: string;
}) {
  return getQueue().add('convert', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  });
}
