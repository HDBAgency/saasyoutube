import Image from 'next/image';
import { formatDuration } from '@/lib/utils';
import type { AnalyzeResponse } from '@saasyoutube/shared';

export function VideoInfo({ metadata }: { metadata: AnalyzeResponse }) {
  return (
    <div className="flex gap-4 bg-gray-100 rounded-xl p-4 text-left">
      {metadata.thumbnail && (
        <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={metadata.thumbnail}
            alt={metadata.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate" title={metadata.title}>
          {metadata.title}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {metadata.duration > 0 && formatDuration(metadata.duration)}
          {' · '}
          <span className="capitalize">{metadata.platform}</span>
        </p>
      </div>
    </div>
  );
}
