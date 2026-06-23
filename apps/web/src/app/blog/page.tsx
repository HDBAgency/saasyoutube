import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Guides & conseils sur le téléchargement vidéo',
  description: 'Guides pratiques pour télécharger et convertir des vidéos en MP3, MP4 depuis YouTube, TikTok et plus.',
};

const POSTS = [
  {
    slug: 'comment-telecharger-youtube-mp3',
    title: 'Comment télécharger une vidéo YouTube en MP3',
    date: '2024-01-15',
    excerpt: 'Guide complet pour convertir vos vidéos YouTube favorites en MP3 en quelques clics.',
  },
  {
    slug: 'tiktok-downloader-sans-filigrane',
    title: 'Télécharger des vidéos TikTok sans filigrane',
    date: '2024-01-10',
    excerpt: 'Méthode simple pour sauvegarder des vidéos TikTok en haute qualité.',
  },
  {
    slug: 'meilleurs-formats-audio',
    title: 'MP3 vs M4A vs WAV — Quel format choisir ?',
    date: '2024-01-05',
    excerpt: 'Comparatif des formats audio pour choisir celui qui correspond à votre usage.',
  },
];

export default function BlogPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10 gradient-text">Blog</h1>
      <div className="space-y-6">
        {POSTS.map((post) => (
          <article key={post.slug} className="glass rounded-xl p-6">
            <time className="text-xs text-slate-500">{post.date}</time>
            <h2 className="text-lg font-semibold text-white mt-1 mb-2">{post.title}</h2>
            <p className="text-slate-400 text-sm">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
