'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROJECTS } from '@/data/projects';

/** Vue INDEX 2D : liste titre — catégorie — année. Survol = cover. Clic = page projet. */
export default function IndexView() {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);
  const active = PROJECTS.find((p) => p.slug === hover);

  return (
    <div className="relative w-full bg-paper px-5 pb-10 pt-28 sm:pt-36 md:px-8 md:pt-44">
      {/* aperçu cover qui suit le survol */}
      {active && (
        <div className="pointer-events-none fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 md:block">
          <img
            src={active.cover}
            alt=""
            className="h-[60vh] w-auto object-cover opacity-90 shadow-sm"
          />
        </div>
      )}

      <div className="caps mx-auto mb-6 max-w-6xl text-[10px] text-ink/40">
        Index — {PROJECTS.length} projets
      </div>
      <ul className="mx-auto max-w-6xl">
        {PROJECTS.map((p, i) => (
          <li key={p.slug} className="border-t border-white/15 last:border-b">
            <button
              onMouseEnter={() => setHover(p.slug)}
              onMouseLeave={() => setHover(null)}
              onClick={() => router.push(`/projects/${p.slug}`)}
              className="grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-3 py-5 text-left transition-opacity md:grid-cols-[2.5rem_1fr_auto_5rem] md:gap-4 md:py-8"
              style={{ opacity: hover && hover !== p.slug ? 0.35 : 1 }}
            >
              <span className="text-[10px] tabular-nums text-ink/40">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-2xl font-bold uppercase tracking-[-0.04em] md:text-5xl">
                {p.title}
              </span>
              <span className="caps text-[10px] text-ink/50">{p.category}</span>
              <span className="hidden text-right text-[10px] tabular-nums text-ink/40 md:block">
                {p.year}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
