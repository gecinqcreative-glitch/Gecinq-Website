'use client';

import { usePathname } from 'next/navigation';

// Surcouche esthétique globale (non-interactive) : grain filmique + vignette +
// micro-labels de coin. Les labels ne s'affichent que sur l'accueil (les pages
// 2D ont leur footer).
export default function Chrome() {
  const pathname = usePathname();
  const home = pathname === '/';

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none">
      {/* vignette douce sur les bords → profondeur */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* grain filmique subtil */}
      <div className="grain absolute inset-0" />

      {/* micro-label bas-gauche (accueil uniquement, masqué sur mobile) */}
      {home && (
        <div className="absolute bottom-5 left-7 hidden text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/35 sm:block">
          <div>Lausanne — CH</div>
          <div>© 2026 Gecinq Creative</div>
        </div>
      )}
    </div>
  );
}
