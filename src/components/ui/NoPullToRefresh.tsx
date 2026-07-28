'use client';

import { useEffect } from 'react';

/**
 * Renfort anti « pull-to-refresh » (tactile uniquement) : là où
 * overscroll-behavior n'est pas respecté (Safari iOS, Chrome iOS), on
 * intercepte le geste exact du refresh — page déjà tout en haut + doigt qui
 * tire vers le bas — et on l'annule. Le scroll normal n'est pas affecté
 * (preventDefault ne s'applique qu'à l'overscroll au sommet), et les
 * listeners du site continuent de recevoir l'événement.
 */
export default function NoPullToRefresh() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return;

    let y0 = 0;
    const onStart = (e: TouchEvent) => {
      y0 = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      const atTop = (document.scrollingElement?.scrollTop ?? 0) <= 0;
      if (atTop && e.touches[0].clientY > y0 && e.cancelable) {
        e.preventDefault();
      }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
    };
  }, []);

  return null;
}
