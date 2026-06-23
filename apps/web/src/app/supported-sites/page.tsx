import type { Metadata } from 'next';
import { SUPPORTED_PLATFORMS } from '@saasyoutube/shared';

export const metadata: Metadata = {
  title: 'Sites supportés — Toutes les plateformes compatibles',
  description: 'Liste complète des plateformes vidéo supportées par VideoSave : YouTube, TikTok, Instagram et plus.',
};

const EXTRA_SITES = [
  'Vimeo', 'Twitch', 'Reddit', 'Pinterest', 'LinkedIn', 'Snapchat',
  'SoundCloud', 'Mixcloud', 'Bandcamp', 'Bilibili', 'Niconico', 'VK',
];

export default function SupportedSitesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4 gradient-text">Sites supportés</h1>
      <p className="text-slate-400 mb-10">
        VideoSave utilise yt-dlp, qui supporte plus de 1 000 sites. Voici les principaux.
      </p>

      <h2 className="font-semibold text-white mb-4">Plateformes principales</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {SUPPORTED_PLATFORMS.map((p) => (
          <div key={p.name} className="glass rounded-xl p-4 font-medium text-slate-200">
            {p.name}
            <p className="text-xs text-slate-500 mt-0.5">{p.domain}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold text-white mb-4">Et bien d'autres…</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {EXTRA_SITES.map((s) => (
          <div key={s} className="bg-slate-900 rounded-lg p-2 text-center text-xs text-slate-400">
            {s}
          </div>
        ))}
      </div>
    </main>
  );
}
