import type { JobStatus } from '@saasyoutube/shared';

const STATUS_LABELS: Record<JobStatus, string> = {
  pending: "En file d'attente...",
  processing: 'Conversion en cours...',
  done: 'Terminé !',
  error: 'Erreur',
};

interface ProgressBarProps {
  status: JobStatus;
  progress: number;
  error?: string;
}

export function ProgressBar({ status, progress, error }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{STATUS_LABELS[status]}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            status === 'error' ? 'bg-red-500' : 'bg-brand-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
