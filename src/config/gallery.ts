// ─────────────────────────────────────────────────────────────────────────────
// GALLERY — réglage central de l'effet "couloir diagonal" type unveil.fr
// Tout réglage fin de l'effet se fait ICI. Chaque valeur est commentée.
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from 'three';

export const GALLERY = {
  bg: '#000000', // fond noir pur

  fog: {
    color: '#000000', // même teinte que le fond → les plans lointains se dissolvent dans le noir
    near: 7, // distance où le fog commence
    far: 25, // distance où tout est 100% fog
  },

  fov: 45, // focale caméra : large → on cadre tout le ruban (≥ 9 vitrines visibles)

  // Décalage entre 2 plans consécutifs : droite (+x), haut (+y), fond (−z).
  // Vitrines RAPPROCHÉES (faible step) → ruban dense ; la dernière visible atterrit
  // dans le COIN haut-droite, la vitrine proche dans le coin bas-gauche.
  // step RESSERRÉ → vitrines plus rapprochées (ruban plus dense).
  step: { x: 1.12, y: 0.69, z: 0.98 },

  // Décalage de départ : on saute les N premières positions (coupées en bas-gauche).
  // 1 → le tile d'index 0 s'affiche là où l'index 1 s'affichait → 1er projet entièrement visible.
  startSkip: 1,

  // Plans : TOUTES les vitrines ont la MÊME taille (boîte uniforme w×h).
  // Les médias se recadrent en "cover" dans la boîte → même taille partout, sans déformation.
  plane: { w: 2.4, h: 3.0, rotY: -0.3, rotX: 0 },

  // ÉPAISSEUR 3D : chaque vitrine est une fine dalle. Seules les TRANCHES sont
  // sombres (les faces avant/arrière restent transparentes) → on voit la profondeur
  // du verre à l'angle, sans assombrir l'image. depth = épaisseur monde.
  depth: 0.06, // épaisseur de la dalle (plus grand = tranche plus visible)
  slab: { color: '#1a1a1a', opacity: 0.65 }, // teinte + intensité des tranches
  glass: { opacity: 0 }, // reflet "verre" diagonal par-dessus chaque vitrine (0 = désactivé)

  // Nombre de fois où la liste des projets est répétée dans le ruban.
  // 1 = chaque projet affiché UNE seule fois (pas de doublon) → 7 vitrines.
  repeat: 1,

  opacity: 0.74, // opacité de base des IMAGES → chevauchement translucide (un peu plus transparent)
  opacityVideo: 0.96, // les VIDÉOS restent bien visibles (quasi opaques)
  damping: 0.2, // réactivité caméra au scroll (plus grand = plus rapide / moins de traîne)
  scrollPages: 7, // longueur de la traversée (plus petit = on avance plus vite au scroll)

  // Cadrage : recul (z) + décalage qui pose la vitrine de devant en bas-gauche,
  // mais ENTIÈREMENT visible (plus dans le coin extrême, sinon elle déborde).
  camOffset: { x: 2.4, y: 1.3, z: 6.2 },

  // PROFONDEUR PAR ASSOMBRISSEMENT (tuiles 100% opaques, pas de transparence).
  // La couleur de la tuile est multipliée par une luminosité dictée par son RANG
  // de profondeur depuis l'avant (1 = tuile la plus en avant), recalculé en continu.
  // On interpole en douceur entre ces paliers. 7ᵉ rang et au-delà → 0 (noir complet).
  brightnessStops: [1, 0.8, 0.6, 0.4, 0.2, 0.1, 0],

  hoverScale: 1.04, // facteur d'agrandissement au survol (+4 %)

  // DÉFILEMENT AUTOMATIQUE (boucle infinie) + scroll manuel + survol.
  auto: {
    speed: 0.11, // unités de "tuile" par seconde (auto lent et régulier)
    resumeDelay: 900, // ms avant reprise de l'auto après survol / scroll manuel
    dim: 0.42, // luminosité des AUTRES tuiles quand une est survolée (≈ overlay ~58%)
    wheelSens: 0.00035, // sensibilité de la molette (scroll manuel — bien plus lent)
    touchSens: 0.004, // sensibilité du drag tactile (mobile)
    decay: 0.85, // inertie du scroll manuel (plus petit = s'arrête plus vite)
    parallaxX: 0.55, // amplitude parallaxe caméra à la souris (horizontal)
    parallaxY: 0.35, // amplitude parallaxe caméra à la souris (vertical)
  },
} as const;

// Vecteur directeur du couloir (réutilisé partout) : chaque plan i est à STEP_VEC * i.
export const STEP_VEC = new THREE.Vector3(
  GALLERY.step.x,
  GALLERY.step.y,
  -GALLERY.step.z,
);

export type GalleryConfig = typeof GALLERY;

// ─────────────────────────────────────────────────────────────────────────────
// HOVER — au survol, la vitrine se détache de la file (glisse vers la caméra +
// un peu de côté), passe à pleine opacité, son nom s'affiche. Retour amorti.
// ─────────────────────────────────────────────────────────────────────────────
export const HOVER = {
  // léger avancement vers la caméra (+z) pour que la tuile focus passe devant
  // les autres, sans dérive latérale → focus net plutôt que "sort de la file".
  offset: [0, 0, 0.25] as [number, number, number],
  scale: 1.05, // léger zoom au survol
  damping: 0.22, // vitesse du décalage ET du retour (plus grand = plus vif/réactif)
};
