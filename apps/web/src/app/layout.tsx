import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdBanner } from '@/components/AdBanner';
import { CookieBanner } from '@/components/CookieBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'VideoSave — Téléchargez YouTube, TikTok, Instagram en MP3/MP4',
    template: '%s | VideoSave',
  },
  description:
    'Convertisseur vidéo gratuit. Téléchargez YouTube, TikTok, Instagram, Twitter et plus en MP3, MP4, WAV en quelques secondes.',
  keywords: ['youtube mp3', 'télécharger vidéo', 'convertir mp3', 'tiktok downloader', 'instagram downloader'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: 'VideoSave',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2915607826796031"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <QueryProvider>
          <Navbar />
          <div className="flex-1 flex">
            {/* Left ad */}
            <div className="hidden xl:flex items-start justify-end pt-16 px-4 w-48 flex-shrink-0">
              <div className="sticky top-24">
                <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} size="160x600" />
              </div>
            </div>
            {/* Main content */}
            <div className="flex-1 min-w-0">{children}</div>
            {/* Right ad */}
            <div className="hidden xl:flex items-start justify-start pt-16 px-4 w-48 flex-shrink-0">
              <div className="sticky top-24">
                <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} size="160x600" />
              </div>
            </div>
          </div>
          <Footer />
          <CookieBanner />
        </QueryProvider>
      </body>
    </html>
  );
}
