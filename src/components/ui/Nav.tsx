'use client';

import Link from 'next/link';

const LINKS = [
  { label: 'Qui nous sommes', href: '/qui-nous-sommes' },
  { label: 'Contacter nous', href: '/contact' },
];

/** Nav fixe haut-gauche, responsive : logo + liens. */
export default function Nav() {
  return (
    <nav className="pointer-events-none fixed left-4 top-1 z-50 flex items-center gap-3 sm:left-6 sm:gap-5 md:-top-2 md:left-7 md:gap-8">
      <Link href="/" className="pointer-events-auto shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-white.png"
          alt="GECINQ CREATIVE"
          className="h-16 w-auto sm:h-24 md:h-36"
        />
      </Link>
      <div className="pointer-events-auto flex items-center gap-4 sm:gap-6 md:gap-10">
        {LINKS.map((p) => (
          <Link
            key={p.label}
            href={p.href}
            className="relative whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.02em] text-ink/90 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100 sm:text-xs md:text-sm"
          >
            {p.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
