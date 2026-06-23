import type { Metadata } from 'next';
import { ConverterSection } from '@/components/ConverterSection';
import { AdBanner } from '@/components/AdBanner';
import { PremiumButton } from '@/components/PremiumButton';
import { SUPPORTED_PLATFORMS } from '@saasyoutube/shared';

export const metadata: Metadata = {
  title: 'VideoSave — Téléchargeur YouTube, TikTok, Instagram MP3/MP4 Gratuit',
  description:
    'Convertissez et téléchargez des vidéos YouTube, TikTok, Instagram, Twitter en MP3 ou MP4 gratuitement et sans limite.',
};

export default function HomePage() {
  return (
    <main>
      {/* Header Ad */}
      <div className="flex justify-center py-3">
        <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER} size="728x90" />
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 gradient-text leading-tight inline-block" style={{ animation: 'float-bounce 3s ease-in-out infinite' }}>
          Téléchargez n'importe quelle vidéo
        </h1>
        <p className="text-black text-lg mb-10 max-w-xl mx-auto">
          YouTube, TikTok, Instagram, Twitter — MP3, MP4, WAV en quelques secondes. Gratuit.
        </p>
        <ConverterSection />
      </section>

      {/* Supported platforms */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-center text-gray-700 mb-6 uppercase tracking-wide">Sites supportés</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SUPPORTED_PLATFORMS.map((p) => (
            <div
              key={p.name}
              className="rounded-xl py-4 px-2 text-center text-sm font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}
            >
              {p.name}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-center text-gray-700 mb-8 uppercase tracking-wide">Offre</h2>
        <div className="flex justify-center">

          {/* Premium */}
          <div className="rounded-2xl p-8 flex flex-col gap-4 relative overflow-hidden w-full max-w-sm shadow-2xl" style={{ background: 'linear-gradient(135deg,#38bdf8,#818cf8)' }}>
            <div className="absolute top-3 right-3 bg-white text-xs font-bold px-2 py-0.5 rounded-full text-purple-600">
              Recommandé
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Premium</span>
              <div className="text-3xl font-extrabold text-white mt-1">4,99 €<span className="text-base font-medium text-white/70">/mois</span></div>
            </div>
            <ul className="text-sm text-white space-y-2 flex-1">
              <li>✅ Téléchargements illimités</li>
              <li>✅ Tous les formats disponibles</li>
              <li>✅ Toutes les plateformes</li>
              <li>✅ Zéro publicité</li>
              <li>✅ Pas de compte à rebours</li>
            </ul>
            <PremiumButton />
          </div>

        </div>
      </section>

      {/* Sidebar Ad */}
      <div className="flex justify-center pb-8">
        <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} size="300x250" />
      </div>
    </main>
  );
}
