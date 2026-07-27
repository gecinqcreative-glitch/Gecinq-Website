// Constantes partagées SERVEUR (page projet) + CLIENT. Aucun hook, aucun three.

// Réglages de la transition tuile → page projet (Option B : zoom caméra 3D).
export const TRANSITION = {
  zoomMs: 580, // durée du dolly caméra vers la tuile
  fadeMs: 340, // fallback mobile / reduced-motion : crossfade simple
  coverAt: 0.66, // fraction du zoom où le crossfade DOM (cover) commence
  coverFadeMs: 200, // durée du crossfade DOM
  holdMs: 240, // maintien du cover après navigation (le temps que la page rende)
  heroVh: 82, // hauteur du hero (vh) = cadrage de fin de zoom (= hauteur du cover)
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;
