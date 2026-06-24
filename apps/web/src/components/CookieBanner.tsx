'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem('cookie_consent', 'accepted'); setVisible(false); };
  const decline = () => { localStorage.setItem('cookie_consent', 'declined'); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-600 flex-1">
          Nous utilisons des cookies pour améliorer votre expérience et afficher des publicités personnalisées via Google AdSense.{' '}
          <Link href="/privacy" className="text-blue-600 underline">En savoir plus</Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="px-4 py-2 text-sm border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50">
            Refuser
          </button>
          <button onClick={accept} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
