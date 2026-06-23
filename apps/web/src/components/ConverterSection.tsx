'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AnalyzeResponse, JobStatusResponse, OutputFormat } from '@saasyoutube/shared';
import { FORMAT_LABELS } from '@saasyoutube/shared';
import { VideoInfo } from './VideoInfo';
import { AdInterstitial } from './AdInterstitial';
import { ProgressBar } from './ProgressBar';

const COUNTDOWN = parseInt(process.env.NEXT_PUBLIC_AD_COUNTDOWN_SECONDS ?? '5');
const PREMIUM_FORMATS: OutputFormat[] = ['mp3-hd', 'mp4-1080p'];

export function ConverterSection() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<OutputFormat>('mp3');
  const [showAd, setShowAd] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  // Fetch user plan
  const { data: me } = useQuery<{ plan: 'free' | 'premium'; email: string | null }>({
    queryKey: ['me'],
    queryFn: () => fetch('/api/auth/me').then((r) => r.json()),
    staleTime: 60_000,
  });
  const isPremium = me?.plan === 'premium';

  const analyzeMutation = useMutation<AnalyzeResponse, Error, string>({
    mutationFn: async (inputUrl) => {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur inconnue');
      return data;
    },
    onSuccess: (data) => {
      if (data.formats.length > 0) setFormat(data.formats[0]);
    },
  });

  const convertMutation = useMutation<{ jobId: string }, Error, { url: string; format: OutputFormat }>({
    mutationFn: async (payload) => {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, title: analyzeMutation.data?.title ?? '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur inconnue');
      return data;
    },
    onSuccess: (data) => setJobId(data.jobId),
  });

  const { data: jobStatus } = useQuery<JobStatusResponse>({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const res = await fetch(`/api/job/${jobId}/status`);
      return res.json();
    },
    enabled: !!jobId && !downloadToken,
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      if (s === 'done' || s === 'error') return false;
      return 1000;
    },
  });

  useEffect(() => {
    if (jobStatus?.status === 'done' && jobStatus.downloadToken) {
      setDownloadToken(jobStatus.downloadToken);
    }
  }, [jobStatus]);

  const reset = () => {
    setUrl('');
    setJobId(null);
    setDownloadToken(null);
    analyzeMutation.reset();
    convertMutation.reset();
  };

  const handleDownloadClick = async () => {
    // Format premium sélectionné par un utilisateur gratuit → checkout Stripe
    if (PREMIUM_FORMATS.includes(format) && !isPremium) {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const { url: checkoutUrl } = await res.json();
      if (checkoutUrl) window.location.href = checkoutUrl;
      return;
    }
    setShowAd(true);
  };

  const handleAdComplete = () => {
    setShowAd(false);
    convertMutation.mutate({ url, format });
  };

  const isPremiumFormat = (f: OutputFormat) => PREMIUM_FORMATS.includes(f);

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      {/* URL input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          analyzeMutation.mutate(url);
        }}
        className="flex gap-2"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Collez une URL YouTube, TikTok, Instagram…"
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-black text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 transition-colors"
          required
        />
        <button
          type="submit"
          disabled={analyzeMutation.isPending}
          className="px-6 py-3 mirror-btn text-white disabled:opacity-50 rounded-xl font-semibold whitespace-nowrap"
        >
          {analyzeMutation.isPending ? '…' : 'Analyser'}
        </button>
      </form>

      {analyzeMutation.isError && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl text-sm">
          {analyzeMutation.error.message}
        </div>
      )}

      {analyzeMutation.data && (
        <div className="space-y-4">
          <VideoInfo metadata={analyzeMutation.data} />

          {/* Format selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {analyzeMutation.data.formats.map((f) => {
              const locked = isPremiumFormat(f) && !isPremium;
              return (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors relative ${
                    locked && format === f
                      ? 'text-white'
                      : locked
                      ? 'bg-gray-100 text-gray-400 border border-purple-400 cursor-pointer'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={
                    locked && format === f
                      ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }
                      : !locked && format === f
                      ? { background: 'linear-gradient(135deg,#16a34a,#15803d)' }
                      : !locked
                      ? { background: 'linear-gradient(135deg,#38bdf8,#818cf8)' }
                      : undefined
                  }
                >
                  {locked && (
                    <span
                      className="mr-1 inline-block"
                      style={{ animation: 'lock-shake 2.5s ease-in-out infinite' }}
                    >
                      🔒
                    </span>
                  )}
                  {FORMAT_LABELS[f]}
                  {locked && (
                    <span className={`block text-[10px] font-semibold leading-none mt-0.5 ${format === f ? 'text-white' : 'text-purple-500'}`}>
                      Premium
                    </span>
                  )}
                </button>
              );
            })}
          </div>


          {/* Action button */}
          {!jobId && !downloadToken && !convertMutation.isPending && (
            <button
              onClick={handleDownloadClick}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors text-white ${
                isPremiumFormat(format) && !isPremium
                  ? 'bg-purple-600 hover:bg-purple-500'
                  : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              {isPremiumFormat(format) && !isPremium
                ? '⭐ Passer Premium pour télécharger →'
                : `Télécharger en ${FORMAT_LABELS[format]} →`}
            </button>
          )}

          {(jobId || convertMutation.isPending) && !downloadToken && jobStatus && (
            <ProgressBar
              status={jobStatus.status}
              progress={jobStatus.progress}
              error={jobStatus.error}
            />
          )}

          {downloadToken && (
            <div className="space-y-3">
              <a
                ref={downloadRef}
                href={`/api/download/${downloadToken}`}
                className="block w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg text-center transition-colors"
              >
                Télécharger le fichier ↓
              </a>
              <button
                onClick={reset}
                className="w-full py-2 text-black hover:text-gray-700 text-sm font-bold transition-colors"
              >
                Nouvelle conversion
              </button>
            </div>
          )}

          {convertMutation.isError && (
            <p className="text-red-600 text-sm text-center">{convertMutation.error.message}</p>
          )}
        </div>
      )}

      {showAd && (
        <AdInterstitial
          countdownSeconds={COUNTDOWN}
          onComplete={handleAdComplete}
          onClose={() => setShowAd(false)}
        />
      )}
    </div>
  );
}
