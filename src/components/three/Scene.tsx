'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GALLERY } from '@/config/gallery';
import {
  startProjectTransition,
  useTransition,
} from '@/lib/transition';
import { prefersReducedMotion, isCoarsePointer } from '@/lib/heroLayout';
import Gallery from './Gallery';
import type { SelectFn } from './ProjectPlane';

/**
 * Focale adaptative : la caméra a une focale VERTICALE fixe, donc sur un écran
 * étroit (mobile portrait) on voit beaucoup moins du couloir en largeur. On
 * élargit la focale quand l'aspect < 1 pour recadrer un ruban lisible, avec un
 * plafond pour éviter la déformation « fisheye ». Recalcul à chaque resize/rotation.
 */
function ResponsiveCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useEffect(() => {
    const aspect = size.width / size.height;
    const fov =
      aspect >= 1
        ? GALLERY.fov
        : THREE.MathUtils.clamp((GALLERY.fov / aspect) * 0.82, GALLERY.fov, 64);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);
  return null;
}

/** Galerie 3D plein écran. Au clic : dolly caméra vers la tuile (cf. Rig) puis crossfade. */
export default function Scene() {
  const router = useRouter();
  const t = useTransition();
  const active = t.phase === 'active';

  const handleSelect: SelectFn = (slug, cover, camPos, camLook) => {
    document.body.style.cursor = 'auto';
    // desktop → zoom caméra 3D ; mobile / reduced-motion → crossfade simple
    const mode = prefersReducedMotion() || isCoarsePointer() ? 'fade' : 'zoom';
    router.prefetch(`/projects/${slug}`);
    startProjectTransition({ slug, cover, mode, camPos, camLook });
  };

  return (
    <div
      className="fixed inset-0 bg-paper"
      style={{ pointerEvents: active ? 'none' : 'auto' }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{
          fov: GALLERY.fov,
          position: [
            GALLERY.camOffset.x,
            GALLERY.camOffset.y,
            GALLERY.camOffset.z,
          ],
        }}
      >
        <color attach="background" args={[GALLERY.bg]} />
        <fog
          attach="fog"
          args={[GALLERY.fog.color, GALLERY.fog.near, GALLERY.fog.far]}
        />
        <ResponsiveCamera />
        <Suspense fallback={null}>
          <Gallery onSelect={handleSelect} />
        </Suspense>
      </Canvas>
    </div>
  );
}
