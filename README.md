# GECINQ® — galerie scroll « unveil »

Couloir diagonal de plans translucides traversé à la caméra (style [unveil.fr](https://unveil.fr)).
Next.js (App Router) · TypeScript · Tailwind · `@react-three/fiber` + `@react-three/drei`.

## Lancer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de prod (doit passer sans erreur TS)
```

## Régler l'effet

**Tout** se règle dans [`src/config/gallery.ts`](src/config/gallery.ts) — chaque valeur est commentée :
`spacing.z` (chevauchement), `opacity` (translucidité 0.82), `damping` (inertie),
`fog` (fondu blanc de profondeur), `plane.rotY` (angle des « pages »), `hoverScale`…

## Mes vraies images

Placeholders SVG actuels générés par `node scripts/gen-placeholders.mjs`.
Pour mettre tes assets, dépose-les dans `public/projects/{slug}/` :

```
public/projects/poz-dca-lab/cover.webp   ← plan 3D + vignette index (~1600px, portrait)
public/projects/poz-dca-lab/01.webp …    ← galerie éditoriale de la page projet
```

Puis mets à jour les chemins (`.svg` → `.webp`) dans [`src/data/projects.ts`](src/data/projects.ts)
(adapte les helpers `cover()` / `shot()`). Les 5 projets et leur ordre (`nextSlug` boucle) y sont définis.

## Structure

| Chemin | Rôle |
|---|---|
| `src/config/gallery.ts` | toutes les valeurs magiques de l'effet |
| `src/data/projects.ts` | les 5 projets |
| `src/components/three/Scene.tsx` | `<Canvas>` + `ScrollControls` + fog + overlay de transition |
| `src/components/three/Gallery.tsx` | rig caméra (traversée au scroll) + mapping des plans |
| `src/components/three/ProjectPlane.tsx` | un plan translucide (opacité/grayscale par distance, survol, label) |
| `src/components/ui/` | Nav, ViewToggle (OVERVIEW/INDEX), IndexView |
| `src/app/projects/[slug]/page.tsx` | page projet (intro + éditorial 2 colonnes + NEXT PROJECT) |

Sans WebGL (ou navigateur incompatible) → bascule automatique sur la vue **INDEX**.
