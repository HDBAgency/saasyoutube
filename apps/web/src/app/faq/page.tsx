import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Questions fréquentes',
  description: 'Toutes les réponses à vos questions sur VideoSave : formats, limites, sécurité.',
};

const FAQS = [
  {
    q: 'Quels sites sont supportés ?',
    a: "VideoSave supporte YouTube, TikTok, Instagram, Twitter/X, Facebook, Dailymotion et des centaines d'autres sites via yt-dlp.",
  },
  {
    q: 'Quels formats puis-je télécharger ?',
    a: 'MP3 (128kbps ou 320kbps), MP4 (360p, 720p, 1080p), M4A et WAV selon la qualité disponible de la vidéo source.',
  },
  {
    q: "Y a-t-il une limite de durée ?",
    a: "Oui, les vidéos de plus de 60 minutes ne peuvent pas être converties pour éviter les abus.",
  },
  {
    q: 'Combien de temps le fichier est-il disponible ?',
    a: 'Le lien de téléchargement est valable 30 minutes. Passé ce délai, le fichier est supprimé de nos serveurs.',
  },
  {
    q: 'Est-ce légal ?',
    a: "Télécharger des vidéos pour un usage strictement personnel peut être toléré dans certains pays. Vous êtes responsable du respect des droits d'auteur.",
  },
  {
    q: 'Pourquoi y a-t-il une publicité avant le téléchargement ?',
    a: 'La publicité nous permet de maintenir ce service gratuit et de couvrir les coûts de serveur.',
  },
];

export default function FAQPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Questions fréquentes</h1>
      <div className="space-y-6">
        {FAQS.map((item) => (
          <div key={item.q} className="bg-gray-50 border border-black rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-2">{item.q}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
