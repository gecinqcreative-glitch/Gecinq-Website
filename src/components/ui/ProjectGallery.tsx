'use client';

import { useCallback, useEffect, useState } from 'react';
import type { GalleryItem } from '@/data/projects';
import Reveal from './Reveal';

/**
 * Galerie « justifiée » : des RANGÉES de hauteur uniforme où chaque image garde
 * sa proportion exacte (aucun recadrage). La largeur de chaque image est
 * proportionnelle à son ratio → les bords s'alignent sur tous les écrans,
 * contrairement au masonry en colonnes. Clic sur une image → LIGHTBOX plein
 * écran (← → pour naviguer, Échap ou clic pour fermer).
 */
export default function ProjectGallery({
  title,
  items,
}: {
  title: string;
  items: GalleryItem[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) =>
      setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)),
    [items.length],
  );

  // lightbox ouverte : bloque le scroll de la page + raccourcis clavier
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, step]);

  return (
    <>
      {/* base ~300px par rangée ; flex-grow ∝ ratio → hauteurs égales par rangée */}
      <div className="flex flex-wrap gap-4 md:gap-5">
        {items.map((g, i) => (
          <Reveal
            key={g.src}
            as="figure"
            delay={(i % 3) * 80}
            className="min-w-0 cursor-pointer overflow-hidden"
            style={{
              flex: `${g.r} 1 ${Math.round(g.r * 300)}px`,
              aspectRatio: String(g.r),
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={`${title} — ${i + 1}`}
              loading="lazy"
              onClick={() => setOpen(i)}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </Reveal>
        ))}
        {/* absorbe l'espace restant de la dernière rangée (évite l'étirement) */}
        <div aria-hidden className="flex-[3_1_0%]" />
      </div>

      {/* Lightbox plein écran */}
      {open !== null && (
        <div
          role="dialog"
          aria-modal
          aria-label={`${title} — visuel ${open + 1} sur ${items.length}`}
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/95"
          onClick={close}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={items[open].src}
            alt={`${title} — ${open + 1}`}
            className="max-h-[92vh] max-w-[94vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            aria-label="Fermer"
            onClick={close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-2xl text-ink/70 transition-colors hover:text-ink"
          >
            ×
          </button>

          {items.length > 1 && (
            <>
              <button
                aria-label="Image précédente"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-2xl text-ink/60 transition-colors hover:text-ink md:left-5"
              >
                ←
              </button>
              <button
                aria-label="Image suivante"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-2xl text-ink/60 transition-colors hover:text-ink md:right-5"
              >
                →
              </button>
              <div className="caps absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] tabular-nums text-ink/50">
                {open + 1} / {items.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
