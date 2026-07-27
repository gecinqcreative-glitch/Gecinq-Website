'use client';

import { forwardRef, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Image, Html, useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import { GALLERY, HOVER, STEP_VEC } from '@/config/gallery';
import { dampAlpha } from '@/lib/damp';
import { cameraTargetForTile, type Vec3 } from '@/lib/transition';
import { TRANSITION } from '@/lib/heroLayout';
import type { Project } from '@/data/projects';

// callback de sélection : slug + poster + cible caméra (position/visée) de la tuile
export type SelectFn = (
  slug: string,
  cover: string,
  camPos: Vec3,
  camLook: Vec3,
) => void;

const { plane, depth, slab, glass } = GALLERY;
const STOPS = GALLERY.brightnessStops; // luminosité par rang de profondeur (1 = devant)
const DIM = GALLERY.auto.dim; // luminosité des autres tuiles quand une est survolée
const OFFSET = new THREE.Vector3(...HOVER.offset); // avancement monde au survol
const BRIGHT_LERP = 0.14; // lissage luminosité (référence 60 fps)
const W = plane.w; // largeur uniforme
const H = plane.h; // hauteur uniforme
const FRONT_SLOT = 1; // rang de la tuile "de devant" bien cadrée

const mod = (x: number, n: number) => ((x % n) + n) % n;

// rang cyclique d'une tuile (0 = en train de sortir devant, →count = tout au fond)
const rankOf = (index: number, phase: number, count: number) =>
  mod(index - phase + FRONT_SLOT, count);

// Luminosité par rang de profondeur (1 = devant). Interpolation douce entre paliers.
function brightnessAt(pos: number): number {
  const idx = Math.max(0, pos - 1);
  const lo = Math.floor(idx);
  if (lo >= STOPS.length - 1) return STOPS[STOPS.length - 1];
  return THREE.MathUtils.lerp(STOPS[lo], STOPS[lo + 1], idx - lo);
}

// Opacité "conveyor" : 1 dans la zone visible, fond aux 2 extrémités (c→0 devant,
// c→count au fond) → le recyclage (wrap) se fait dans le noir, invisible.
function bandOpacity(c: number, count: number): number {
  const front = THREE.MathUtils.smoothstep(c, 0, 0.8); // sortie devant
  const far = 1 - THREE.MathUtils.smoothstep(c, count - 1.2, count); // entrée au fond
  return Math.min(front, far);
}

// Texture de reflet "verre" (créée 1× côté client).
let sheenTex: THREE.CanvasTexture | null = null;
function getSheen(): THREE.CanvasTexture {
  if (sheenTex) return sheenTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const ctx = cv.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 256, 256);
  g.addColorStop(0, 'rgba(255,255,255,0.7)');
  g.addColorStop(0.28, 'rgba(255,255,255,0.06)');
  g.addColorStop(0.6, 'rgba(255,255,255,0)');
  g.addColorStop(1, 'rgba(255,255,255,0.16)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  sheenTex = new THREE.CanvasTexture(cv);
  return sheenTex;
}

type Props = {
  project: Project;
  index: number;
  count: number; // nombre total de tuiles (longueur du cycle)
  progress: MutableRefObject<number>; // phase du couloir (monotone) — partagée
  hovered: boolean; // CETTE tuile est survolée
  anyHovered: boolean; // une tuile est survolée → dim des autres
  onHover: (i: number | null) => void;
  onSelect: SelectFn;
};

/**
 * Anime UNE tuile du couloir INFINI :
 *  - position cyclique le long de la diagonale (recyclage en boucle) ;
 *  - opacité qui fond aux 2 extrémités → wrap invisible ;
 *  - luminosité par rang (profondeur) + focus (100%) / dim au survol ;
 *  - léger avancement + zoom au survol. Tuiles opaques dans la zone visible.
 */
function useTilePlane(
  ref: MutableRefObject<THREE.Mesh | null>,
  slabRef: MutableRefObject<THREE.Mesh | null>,
  hovered: boolean,
  anyHovered: boolean,
  index: number,
  count: number,
  phaseRef: MutableRefObject<number>,
) {
  const target = useMemo(() => new THREE.Vector3(), []);
  const hoverAmt = useRef(0);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.Material & {
      opacity: number;
      color: THREE.Color;
    };
    const aMove = dampAlpha(HOVER.damping, delta);
    const aBright = dampAlpha(BRIGHT_LERP, delta);

    // rang cyclique + position (pas de lerp sur la position → pas de "fly" au wrap)
    const c = rankOf(index, phaseRef.current, count);
    hoverAmt.current = THREE.MathUtils.lerp(hoverAmt.current, hovered ? 1 : 0, aMove);
    target.copy(STEP_VEC).multiplyScalar(c).addScaledVector(OFFSET, hoverAmt.current);
    mesh.position.copy(target);

    // zoom au survol (via l'amont lissé)
    const s = 1 + (HOVER.scale - 1) * hoverAmt.current;
    mesh.scale.set(W * s, H * s, 1);

    // opacité conveyor (fondu aux extrémités) ; opaque + depthWrite dans la zone visible
    const op = bandOpacity(c, count);
    mat.transparent = true;
    mat.opacity = op;
    mat.depthWrite = op > 0.9;

    // la TRANCHE 3D (slab) suit la même opacité → pas de barre sombre persistante
    const sm = slabRef.current;
    if (sm) {
      const mats = sm.material as THREE.Material[];
      for (let i = 0; i < 4; i++) mats[i].opacity = slab.opacity * op;
    }

    // luminosité : profondeur (rang) + focus/dim
    const b = brightnessAt(Math.max(1, c)); // c<1 (devant) reste clair
    const wanted = hovered ? 1 : anyHovered ? b * DIM : b;
    mat.color.setScalar(THREE.MathUtils.lerp(mat.color.r, wanted, aBright));
  });
}

// handlers de survol
function pointerProps(index: number, onHover: (i: number | null) => void) {
  return {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onHover(index);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      onHover(null);
      document.body.style.cursor = 'default';
    },
  };
}

// clic : calcule la cible caméra (cadrage de face) puis déclenche la transition
function useTileClick(
  ref: MutableRefObject<THREE.Mesh | null>,
  project: Project,
  onSelect: SelectFn,
) {
  const { camera } = useThree();
  return (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!ref.current) return;
    const { camPos, camLook } = cameraTargetForTile(
      ref.current,
      camera as THREE.PerspectiveCamera,
      TRANSITION.heroVh / 100,
    );
    document.body.style.cursor = 'default';
    onSelect(project.slug, project.cover, camPos, camLook);
  };
}

// Dalle d'ÉPAISSEUR : fine boîte, seules les 4 tranches sont sombres.
// Ref exposée → son opacité est pilotée en même temps que la carte (useTilePlane).
const Slab = forwardRef<THREE.Mesh>(function Slab(_props, ref) {
  return (
    <mesh ref={ref} position={[0, 0, -depth / 2]}>
      <boxGeometry args={[1, 1, depth]} />
      {[0, 1, 2, 3].map((i) => (
        <meshBasicMaterial
          key={i}
          attach={`material-${i}`}
          color={slab.color}
          transparent
          opacity={slab.opacity}
          depthWrite={false}
          toneMapped={false}
        />
      ))}
      <meshBasicMaterial attach="material-4" transparent opacity={0} depthWrite={false} />
      <meshBasicMaterial attach="material-5" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
});

function GlassSheen() {
  if (glass.opacity <= 0) return null;
  return (
    <mesh position={[0, 0, 0.004]}>
      <planeGeometry />
      <meshBasicMaterial
        map={getSheen()}
        transparent
        opacity={glass.opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function HoverLabel({ project, hovered }: { project: Project; hovered: boolean }) {
  if (!hovered) return null;
  return (
    <Html
      position={[0.62, 0.18, 0]}
      className="pointer-events-none select-none"
      zIndexRange={[20, 0]}
    >
      <span className="caps animate-[fadeIn_.25s_ease] whitespace-nowrap text-[11px] font-medium text-ink">
        {project.title}
      </span>
    </Html>
  );
}

// position initiale (phase 0) → évite un flash au 1er rendu
const initialPos = (index: number, count: number) =>
  STEP_VEC.clone().multiplyScalar(rankOf(index, 0, count));

/** Vitrine IMAGE. */
function ImagePlane(p: Props) {
  const ref = useRef<THREE.Mesh>(null);
  const slabRef = useRef<THREE.Mesh>(null);
  useTilePlane(ref, slabRef, p.hovered, p.anyHovered, p.index, p.count, p.progress);
  const onClick = useTileClick(ref, p.project, p.onSelect);
  const pos = initialPos(p.index, p.count);
  return (
    <Image
      ref={ref}
      url={p.project.cover}
      position={[pos.x, pos.y, pos.z]}
      rotation={[plane.rotX, plane.rotY, 0]}
      scale={[W, H]}
      toneMapped={false}
      onClick={onClick}
      {...pointerProps(p.index, p.onHover)}
    >
      <Slab ref={slabRef} />
      <GlassSheen />
      <HoverLabel project={p.project} hovered={p.hovered} />
    </Image>
  );
}

/** Vitrine VIDÉO (si `video` défini). */
function VideoPlane(p: Props) {
  const ref = useRef<THREE.Mesh>(null);
  const slabRef = useRef<THREE.Mesh>(null);
  const texture = useVideoTexture(p.project.video!, {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  });
  useTilePlane(ref, slabRef, p.hovered, p.anyHovered, p.index, p.count, p.progress);
  const onClick = useTileClick(ref, p.project, p.onSelect);
  const pos = initialPos(p.index, p.count);

  useFrame(() => {
    const v = texture.image as HTMLVideoElement | undefined;
    if (!v || !v.videoWidth) return;
    const va = v.videoWidth / v.videoHeight;
    const ba = W / H;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    if (va > ba) texture.repeat.set(ba / va, 1);
    else texture.repeat.set(1, va / ba);
    texture.offset.set((1 - texture.repeat.x) / 2, (1 - texture.repeat.y) / 2);
  });

  return (
    <mesh
      ref={ref}
      position={[pos.x, pos.y, pos.z]}
      rotation={[plane.rotX, plane.rotY, 0]}
      scale={[W, H, 1]}
      onClick={onClick}
      {...pointerProps(p.index, p.onHover)}
    >
      <planeGeometry />
      <meshBasicMaterial map={texture} toneMapped={false} />
      <Slab ref={slabRef} />
      <GlassSheen />
      <HoverLabel project={p.project} hovered={p.hovered} />
    </mesh>
  );
}

export default function ProjectPlane(props: Props) {
  return props.project.video ? (
    <VideoPlane {...props} />
  ) : (
    <ImagePlane {...props} />
  );
}
