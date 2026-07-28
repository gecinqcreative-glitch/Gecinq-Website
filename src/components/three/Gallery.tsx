'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { GALLERY } from '@/config/gallery';
import { useTransition } from '@/lib/transition';
import { TRANSITION } from '@/lib/heroLayout';
import { setCursor } from '@/lib/cursor';
import { PROJECTS } from '@/data/projects';
import ProjectPlane, { type SelectFn } from './ProjectPlane';

type Nav = {
  progress: MutableRefObject<number>; // phase du couloir (monotone, infinie)
  velocity: MutableRefObject<number>; // vitesse du scroll manuel (avec inertie)
  hovered: MutableRefObject<number | null>; // tuile survolée (fige l'auto-scroll)
  resumeAt: MutableRefObject<number>; // timestamp de reprise de l'auto-scroll
  mouse: MutableRefObject<{ x: number; y: number }>; // position souris normalisée (-1..1)
};

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * Rig — caméra FIXE + défilement infini ; PENDANT une transition "zoom", la
 * caméra fait un dolly vers la tuile cliquée (cadrage de face plein cadre).
 */
function Rig({ nav }: { nav: Nav }) {
  const { camera } = useThree();
  const size = useThree((s) => s.size);
  const t = useTransition();
  const zooming = t.phase === 'active' && t.mode === 'zoom' && !!t.camPos;
  // cadrage responsive : en PORTRAIT (mobile) la caméra recule et se recentre
  // sur le couloir pour que le ruban reste lisible dans un cadre étroit.
  const base = useMemo(() => {
    const portrait = size.width / size.height < 1;
    return portrait
      ? new THREE.Vector3(
          GALLERY.camOffset.x - 0.7,
          GALLERY.camOffset.y - 0.25,
          GALLERY.camOffset.z + 0.2,
        )
      : new THREE.Vector3(
          GALLERY.camOffset.x,
          GALLERY.camOffset.y,
          GALLERY.camOffset.z,
        );
  }, [size.width, size.height]);
  const camTarget = useRef(new THREE.Vector3()).current;

  // cibles + point de départ du dolly (capturés au 1er frame de zoom)
  const targets = useMemo(() => {
    if (!t.camPos || !t.camLook) return null;
    return {
      pos: new THREE.Vector3(...t.camPos),
      look: new THREE.Vector3(...t.camLook),
    };
  }, [t.camPos, t.camLook]);
  const start = useRef<{ p: THREE.Vector3; l: THREE.Vector3 } | null>(null);
  const look = useRef(new THREE.Vector3()).current;

  useFrame((_, delta) => {
    // ── transition : dolly caméra vers la tuile ──
    if (zooming && targets) {
      if (!start.current) {
        start.current = {
          p: camera.position.clone(),
          l: new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z - 10,
          ),
        };
      }
      const e = easeOutCubic(
        Math.min(1, (performance.now() - t.t0) / TRANSITION.zoomMs),
      );
      camera.position.lerpVectors(start.current.p, targets.pos, e);
      look.lerpVectors(start.current.l, targets.look, e);
      camera.lookAt(look);
      return;
    }
    start.current = null;

    // ── défilement normal (manuel + auto) ──
    nav.progress.current += nav.velocity.current;
    nav.velocity.current *= GALLERY.auto.decay;
    if (Math.abs(nav.velocity.current) < 1e-4) nav.velocity.current = 0;

    const now = performance.now();
    const idle = nav.hovered.current === null && now >= nav.resumeAt.current;
    if (idle) nav.progress.current += GALLERY.auto.speed * delta;

    // SNAP : pendant la pause après un scroll manuel, recentre en douceur la tuile
    // la plus proche (avant que l'auto ne reprenne).
    const paused = nav.hovered.current === null && now < nav.resumeAt.current;
    if (paused && Math.abs(nav.velocity.current) < 0.0025) {
      const snap = Math.round(nav.progress.current);
      nav.progress.current += (snap - nav.progress.current) * 0.08;
    }

    // parallaxe à la souris : la caméra dérive légèrement, la visée reste fixe → tilt
    const px = nav.mouse.current.x * GALLERY.auto.parallaxX;
    const py = nav.mouse.current.y * GALLERY.auto.parallaxY;
    camTarget.set(base.x + px, base.y + py, base.z);
    camera.position.lerp(camTarget, 0.05);
    camera.lookAt(base.x, base.y, base.z - 10);
  });

  return null;
}

/** Sol réfléchissant subtil sous le couloir → ancre les vitrines (desktop). */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, -1.4, -3]}>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        mirror={0.6}
        resolution={512}
        blur={[500, 140]}
        mixBlur={1}
        mixStrength={0.55}
        color="#0a0a0a"
        metalness={0.15}
        roughness={0.95}
        depthScale={0}
      />
    </mesh>
  );
}

/** Le couloir : un plan par projet, posé sur la diagonale. */
export default function Gallery({ onSelect }: { onSelect: SelectFn }) {
  const [hovered, setHovered] = useState<number | null>(null);

  // état partagé lu/écrit dans les useFrame (sans re-render)
  const progress = useRef(0);
  const velocity = useRef(0);
  const hoveredRef = useRef<number | null>(null);
  const resumeAt = useRef(0);
  const locked = useRef(false); // focus verrouillé pendant la transition
  const mouse = useRef({ x: 0, y: 0 });
  const nav: Nav = { progress, velocity, hovered: hoveredRef, resumeAt, mouse };
  // reflet de sol : desktop uniquement (perf)
  const [reflect] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches,
  );

  const handleHover = (i: number | null) => {
    if (locked.current) return; // ne change plus le focus pendant la transition
    setHovered(i); // pour le highlight/dim des plans
    hoveredRef.current = i; // pour figer l'auto-scroll
    setCursor(i !== null ? 'view' : 'default'); // curseur « VOIR » au survol d'une tuile
    if (i === null) resumeAt.current = performance.now() + GALLERY.auto.resumeDelay;
  };

  // clic sur une tuile : verrouille le focus (tuile éclairée, autres au noir) puis
  // délègue le démarrage de la transition (zoom caméra) au parent (Scene).
  const handleSelect =
    (i: number): SelectFn =>
    (slug, cover, camPos, camLook) => {
      locked.current = true;
      hoveredRef.current = i;
      setHovered(i);
      onSelect(slug, cover, camPos, camLook);
    };

  // SCROLL MANUEL : molette + drag tactile → vitesse (inertie), auto en pause pendant/juste après
  useEffect(() => {
    const bump = () =>
      (resumeAt.current = performance.now() + GALLERY.auto.resumeDelay);
    const onWheel = (e: WheelEvent) => {
      velocity.current += e.deltaY * GALLERY.auto.wheelSens;
      bump();
    };
    let lastX: number | null = null;
    const onTouchStart = (e: TouchEvent) => (lastX = e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (lastX === null) return;
      const x = e.touches[0].clientX;
      // drag HORIZONTAL sur tactile : glisser vers la gauche = avancer (carrousel)
      velocity.current += (lastX - x) * GALLERY.auto.touchSens;
      lastX = x;
      bump();
    };
    const onTouchEnd = () => (lastX = null);
    // souris normalisée (-1..1) pour le parallaxe
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [velocity, resumeAt, mouse]);

  const planes = useMemo(
    () =>
      Array.from({ length: PROJECTS.length * GALLERY.repeat }, (_, i) => ({
        project: PROJECTS[i % PROJECTS.length],
        i,
      })),
    [],
  );

  return (
    <>
      <Rig nav={nav} />
      {reflect && <Floor />}
      {planes.map(({ project, i }) => (
        <ProjectPlane
          key={i}
          project={project}
          index={i}
          count={planes.length}
          progress={progress}
          hovered={hovered === i}
          anyHovered={hovered !== null}
          onHover={handleHover}
          onSelect={handleSelect(i)}
        />
      ))}
    </>
  );
}
