import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'fallback_secret_change_me';
const EXPIRY_MINUTES = parseInt(process.env.DOWNLOAD_EXPIRY_MINUTES ?? '30');

export interface DownloadTokenPayload {
  jobId: string;
  filePath: string;
}

export function createDownloadToken(jobId: string, filePath: string): string {
  return jwt.sign({ jobId, filePath }, SECRET, { expiresIn: `${EXPIRY_MINUTES}m` });
}

export function verifyDownloadToken(token: string): DownloadTokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as DownloadTokenPayload;
  } catch {
    return null;
  }
}
