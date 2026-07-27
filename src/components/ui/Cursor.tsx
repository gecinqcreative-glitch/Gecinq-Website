'use client';

import { useEffect, useRef, useState } from 'react';
import { useCursor, setCursor } from '@/lib/cursor';

/**
 * Curseur personnalisé (desktop, pointeur fin) : un point qui suit la souris en
 * douceur, grossit sur les liens et affiche « VOIR » au survol d'une tuile 3D.
 */
export default function Cursor() {
  const mode = useCursor();
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // uniquement souris fine (pas tactile)
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    // délégation : liens & boutons DOM → mode "link"
    const over = (e: Event) => {
      const el = (e.target as HTMLElement)?.closest?.('a,button,[data-cursor]');
      if (el) setCursor('link');
    };
    const out = (e: Event) => {
      const el = (e.target as HTMLElement)?.closest?.('a,button,[data-cursor]');
      if (el) setCursor('default');
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', over, true);
    document.addEventListener('mouseout', out, true);

    let raf = 0;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', over, true);
      document.removeEventListener('mouseout', out, true);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  if (!enabled) return null;

  const cls =
    mode === 'view'
      ? 'h-16 w-16 bg-white text-ink'
      : mode === 'link'
        ? 'h-10 w-10 border border-white bg-transparent mix-blend-difference'
        : 'h-2.5 w-2.5 bg-white mix-blend-difference';

  return (
    <div
      ref={dot}
      className="pointer-events-none fixed left-0 top-0 z-[200] flex items-center justify-center rounded-full transition-[width,height,background-color] duration-200 ease-out"
      style={{ willChange: 'transform' }}
      aria-hidden
    >
      <span
        className={`flex items-center justify-center rounded-full transition-[width,height] duration-200 ease-out ${cls}`}
      >
        {mode === 'view' && (
          <span className="text-[10px] font-medium uppercase tracking-[0.12em]">
            Voir
          </span>
        )}
      </span>
    </div>
  );
}
