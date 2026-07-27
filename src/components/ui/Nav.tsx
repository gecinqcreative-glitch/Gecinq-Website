'use client';

import { useState } from 'react';
import Link from 'next/link';

const LINKS = [
  { label: 'Qui nous sommes', href: '/qui-nous-sommes' },
  { label: 'Projets', href: '/projets' },
  { label: 'Contacter nous', href: '/contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Logo (toujours, haut-gauche) */}
      <div className="pointer-events-none fixed left-4 top-1 z-[95] flex items-center gap-8 md:-top-2 md:left-7">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="pointer-events-auto shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.png"
            alt="GECINQ CREATIVE"
            className="h-24 w-auto sm:h-28 md:h-40"
          />
        </Link>
        {/* Liens desktop */}
        <nav className="pointer-events-auto hidden items-center gap-10 md:flex">
          {LINKS.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="relative whitespace-nowrap text-sm font-medium uppercase tracking-[0.02em] text-ink/90 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bouton burger (mobile) */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        className="fixed right-4 top-4 z-[110] flex h-11 w-11 flex-col items-center justify-center gap-[6px] md:hidden"
      >
        <span
          className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${
            open ? 'translate-y-[8px] rotate-45' : ''
          }`}
        />
        <span
          className={`block h-[2px] w-6 bg-ink transition-opacity duration-200 ${
            open ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block h-[2px] w-6 bg-ink transition-transform duration-300 ${
            open ? '-translate-y-[8px] -rotate-45' : ''
          }`}
        />
      </button>

      {/* Overlay menu plein écran (mobile) */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col justify-center gap-2 bg-paper px-8 transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {LINKS.map((p, i) => (
          <Link
            key={p.label}
            href={p.href}
            onClick={() => setOpen(false)}
            className="border-b border-white/10 py-5 text-3xl font-bold uppercase tracking-[-0.03em] text-ink transition-opacity hover:opacity-60"
            style={{
              transitionDelay: open ? `${100 + i * 60}ms` : '0ms',
              transform: open ? 'translateY(0)' : 'translateY(8px)',
              opacity: open ? 1 : 0,
              transitionProperty: 'opacity, transform',
            }}
          >
            {p.label}
          </Link>
        ))}
        <a
          href="mailto:gecinqcreative@gmail.com"
          className="mt-8 text-sm text-ink/60"
        >
          gecinqcreative@gmail.com
        </a>
      </div>
    </>
  );
}
