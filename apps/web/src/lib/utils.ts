import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Platform } from '@saasyoutube/shared';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PLATFORM_PATTERNS: [Platform, RegExp][] = [
  ['youtube', /^https?:\/\/(www\.)?(youtube\.com\/watch|youtu\.be\/)/],
  ['tiktok', /^https?:\/\/(www\.)?tiktok\.com\//],
  ['instagram', /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\//],
  ['twitter', /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//],
  ['facebook', /^https?:\/\/(www\.)?facebook\.com\//],
  ['dailymotion', /^https?:\/\/(www\.)?dailymotion\.com\/video\//],
];

export function detectPlatform(url: string): Platform {
  for (const [platform, re] of PLATFORM_PATTERNS) {
    if (re.test(url)) return platform;
  }
  return 'other';
}

export function validateUrl(url: string): boolean {
  return PLATFORM_PATTERNS.some(([, re]) => re.test(url));
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}
