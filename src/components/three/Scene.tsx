'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { GALLERY } from '@/config/gallery';
import {
  startProjectTransition,
  useTransition,
} from '@/lib/transition';
import { prefersReducedMotion, isCoarsePointer } from '@/lib/heroLayout';
import Gallery from './Gallery';
import type { SelectFn } from './ProjectPlane';

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
        <Suspense fallback={null}>
          <Gallery onSelect={handleSelect} />
        </Suspense>
      </Canvas>
    </div>
  );
}
