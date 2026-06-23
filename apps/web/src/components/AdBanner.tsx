'use client';

import { useEffect, useState } from 'react';

interface AdBannerProps {
  slot?: string;
  size?: '728x90' | '300x250' | '320x50' | '160x600';
  className?: string;
}

const FAKE_ADS: Record<string, { bg: string; label: string; sub: string; cta: string }[]> = {
  '728x90': [
    { bg: 'linear-gradient(90deg,#f97316,#ef4444)', label: '🔥 Hostinger', sub: 'Hébergement web à partir de 2,99€/mois', cta: 'Découvrir →' },
    { bg: 'linear-gradient(90deg,#6366f1,#8b5cf6)', label: '🚀 Envato Elements', sub: 'Accès illimité à des milliers de templates', cta: 'Essai gratuit →' },
    { bg: 'linear-gradient(90deg,#0ea5e9,#06b6d4)', label: '💡 NordVPN', sub: 'Protégez votre vie privée en ligne', cta: 'Voir l\'offre →' },
  ],
  '300x250': [
    { bg: 'linear-gradient(135deg,#f59e0b,#ef4444)', label: '🎵 Spotify Premium', sub: 'Musique sans pub pendant 3 mois offerts', cta: 'Commencer →' },
    { bg: 'linear-gradient(135deg,#10b981,#0ea5e9)', label: '📦 Amazon Prime', sub: 'Livraison gratuite + Prime Video', cta: 'Essai 30 jours →' },
    { bg: 'linear-gradient(135deg,#8b5cf6,#ec4899)', label: '🎨 Canva Pro', sub: 'Créez des visuels professionnels', cta: 'Gratuit →' },
  ],
  '160x600': [
    { bg: 'linear-gradient(180deg,#1e40af,#7c3aed)', label: '🔐 ExpressVPN', sub: 'Navigation sécurisée & anonyme partout', cta: 'Voir l\'offre →' },
    { bg: 'linear-gradient(180deg,#065f46,#0ea5e9)', label: '☁️ Dropbox Plus', sub: '2 To de stockage cloud sécurisé', cta: 'Essayer →' },
  ],
  '320x50': [
    { bg: 'linear-gradient(90deg,#dc2626,#f97316)', label: '📱 Rakuten', sub: 'Cashback sur vos achats', cta: 'Rejoindre →' },
  ],
};

function pickAd(size: string) {
  const ads = FAKE_ADS[size] ?? FAKE_ADS['728x90'];
  return ads[Math.floor(Math.random() * ads.length)];
}

function FakeAd({ size, className }: { size: string; className: string }) {
  const [w, h] = size.split('x');
  const [ad, setAd] = useState(() => FAKE_ADS[size]?.[0] ?? FAKE_ADS['728x90'][0]);
  useEffect(() => { setAd(pickAd(size)); }, [size]);
  const isVertical = parseInt(h) > parseInt(w);
  const isLeaderboard = parseInt(w) >= 700;

  return (
    <div
      className={`rounded overflow-hidden flex ${isVertical ? 'flex-col' : 'flex-row'} items-center ${isLeaderboard ? 'justify-between px-6' : 'justify-center'} gap-2 ${className}`}
      style={{ width: `${w}px`, maxWidth: '100%', height: `${h}px`, background: ad.bg }}
    >
      <div className={`font-bold text-white ${isVertical ? 'text-center mt-4 text-lg' : 'text-sm'}`}>
        {ad.label}
      </div>
      <div className={`text-white/90 ${isVertical ? 'text-center text-xs px-3 flex-1' : 'text-xs flex-1'}`}>
        {ad.sub}
      </div>
      <div className={`bg-white/20 border border-white/40 text-white text-xs font-semibold rounded px-3 py-1 whitespace-nowrap ${isVertical ? 'mb-4' : ''}`}>
        {ad.cta}
      </div>
      <div className="absolute bottom-1 right-1 text-white/30 text-[9px]">Annonce</div>
    </div>
  );
}

export function AdBanner({ slot, size = '728x90', className = '' }: AdBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isConfigured = clientId && clientId !== 'ca-pub-XXXXXXXXXX' && slot && slot !== 'XXXXXXXXXX';

  useEffect(() => {
    if (!isConfigured) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [isConfigured]);

  if (!isConfigured) {
    return <FakeAd size={size} className={className} />;
  }

  const [w, h] = size.split('x');
  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: `${w}px`, height: `${h}px` }}
        data-ad-client={clientId}
        data-ad-slot={slot}
      />
    </div>
  );
}
