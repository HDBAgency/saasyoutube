'use client';

import { useEffect, useState } from 'react';
import { AdBanner } from './AdBanner';

interface AdInterstitialProps {
  countdownSeconds?: number;
  onComplete: () => void;
  onClose: () => void;
}

export function AdInterstitial({ countdownSeconds = 5, onComplete, onClose }: AdInterstitialProps) {
  const [remaining, setRemaining] = useState(countdownSeconds);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (remaining <= 0) {
      setDone(true);
      return;
    }
    const timer = setTimeout(() => setRemaining((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-900">Préparez votre téléchargement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl leading-none">✕</button>
        </div>

        <div className="flex justify-center">
          <AdBanner
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INTERSTITIAL}
            size="300x250"
          />
        </div>

        {!done ? (
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-500 mb-2">{remaining}</div>
            <p className="text-gray-500 text-sm">Votre téléchargement sera disponible dans {remaining}s</p>
          </div>
        ) : (
          <button
            onClick={onComplete}
            className="w-full py-4 text-white rounded-xl font-bold text-lg"
            style={{ background: 'linear-gradient(90deg,#16a34a,#15803d)', backgroundSize: '300% auto', animation: 'mirror-shine 4s linear infinite, float-bounce 3s ease-in-out infinite' }}
          >
            TÉLÉCHARGER MAINTENANT →
          </button>
        )}
      </div>
    </div>
  );
}
