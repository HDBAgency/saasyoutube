import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 py-8 text-center text-black text-sm">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 mb-4">
        <Link href="/terms" className="hover:text-black transition-colors">CGU</Link>
        <Link href="/privacy" className="hover:text-black transition-colors">Confidentialité</Link>
        <Link href="/dmca" className="hover:text-black transition-colors">DMCA</Link>
        <Link href="/faq" className="hover:text-black transition-colors">FAQ</Link>
        <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
      </div>
      <p>© {new Date().getFullYear()} VideoSave — Usage personnel uniquement.</p>
    </footer>
  );
}
