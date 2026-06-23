'use client';

import { useState } from 'react';

export function PremiumButton() {
  const [step, setStep] = useState<'idle' | 'register' | 'loading'>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleOpen = () => { setStep('register'); setError(''); };
  const handleClose = () => { setStep('idle'); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 6) { setError('Mot de passe trop court (6 caractères min).'); return; }

    setStep('loading');
    try {
      const reg = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await reg.json();
      if (!reg.ok) { setError(data.error ?? 'Erreur inscription.'); setStep('register'); return; }

      const checkout = await fetch('/api/stripe/checkout', { method: 'POST' });
      const { url } = await checkout.json();
      if (url) window.location.href = url;
    } catch {
      setError('Une erreur est survenue.');
      setStep('register');
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full py-3 bg-white text-purple-700 font-bold rounded-xl"
        style={{ animation: 'premium-pulse 2s ease-in-out infinite' }}
      >
        PASSER AU PREMIUM →
      </button>

      {(step === 'register' || step === 'loading') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-gray-900">CRÉER VOTRE COMPTE</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>
            <p className="text-sm text-black">Votre compte sera activé après le paiement.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900"
                  placeholder="6 caractères minimum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900"
                  placeholder="Répétez le mot de passe"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={step === 'loading'}
                className="w-full py-4 text-white font-bold rounded-xl text-lg disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', animation: 'premium-pulse 2s ease-in-out infinite' }}
              >
                {step === 'loading' ? 'CRÉATION DU COMPTE…' : 'CRÉER MON COMPTE ET PAYER →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
