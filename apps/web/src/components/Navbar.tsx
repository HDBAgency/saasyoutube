'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-white rounded-lg px-4 py-2" style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}>
          VideoSave
        </Link>
        <Link href="/login" className="text-sm font-bold text-white rounded-lg px-4 py-2 transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }} onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg,#16a34a,#15803d)')} onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #38bdf8, #818cf8)')}>
          CONNEXION
        </Link>
      </div>
    </nav>
  );
}
