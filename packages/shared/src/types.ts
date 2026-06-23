export type Platform =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'twitter'
  | 'facebook'
  | 'dailymotion'
  | 'other';

export type OutputFormat =
  | 'mp3'
  | 'mp3-hd'
  | 'mp4-360p'
  | 'mp4-720p'
  | 'mp4-1080p'
  | 'm4a'
  | 'wav';

export type JobStatus = 'pending' | 'processing' | 'done' | 'error';

export interface AnalyzeResponse {
  title: string;
  thumbnail: string;
  duration: number;
  platform: Platform;
  formats: OutputFormat[];
}

export interface ConvertResponse {
  jobId: string;
}

export interface JobStatusResponse {
  status: JobStatus;
  progress: number;
  downloadToken?: string;
  error?: string;
}

export const FORMAT_LABELS: Record<OutputFormat, string> = {
  'mp3': 'MP3 128k',
  'mp3-hd': 'MP3 320k',
  'mp4-360p': 'MP4 360p',
  'mp4-720p': 'MP4 720p',
  'mp4-1080p': 'MP4 1080p',
  'm4a': 'M4A',
  'wav': 'WAV',
};

export const SUPPORTED_PLATFORMS: { name: string; domain: string; color: string }[] = [
  { name: 'YouTube', domain: 'youtube.com', color: '#FF0000' },
  { name: 'TikTok', domain: 'tiktok.com', color: '#010101' },
  { name: 'Instagram', domain: 'instagram.com', color: '#E1306C' },
  { name: 'Twitter / X', domain: 'twitter.com', color: '#1DA1F2' },
  { name: 'Facebook', domain: 'facebook.com', color: '#1877F2' },
  { name: 'Dailymotion', domain: 'dailymotion.com', color: '#0066DC' },
];
