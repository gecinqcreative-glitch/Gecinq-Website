'use client';

import { useEffect, useState } from 'react';

/**
 * Indice d'interaction pour les écrans tactiles : « Glissez pour explorer ».
 * Le glissement du couloir 3D n'est pas découvrable au toucher — ce libellé
 * l'indique, puis disparaît au premier glissement (ou après quelques secondes).
 * Ne s'affiche jamais sur pointeur fin (desktop).
 */
export default function SwipeHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    setShow(true);
    const hide = () => setShow(false);
    const timer = window.setTimeout(hide, 4500);
    window.addEventListener('touchmove', hide, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('touchmove', hide);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center transition-opacity duration-700 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span className="caps flex items-center gap-2 text-[10px] text-ink/50">
        <span className="inline-block animate-pulse">↔</span>
        Glissez pour explorer
      </span>
    </div>
  );
}
