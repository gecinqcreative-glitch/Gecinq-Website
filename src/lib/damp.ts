// Damping indépendant du framerate.
// `k` = facteur de lissage de référence à 60 fps (comme un lerp par frame).
// On le convertit avec `delta` → même ressenti à 60 fps, mais lisse et constant
// quel que soit le framerate (120 Hz, baisses de perf…). Clamp anti-pic (onglet
// en arrière-plan, gros frame) pour éviter un saut brutal au retour.
export const dampAlpha = (k: number, delta: number) =>
  1 - Math.pow(1 - k, Math.min(delta, 0.05) * 60);
