"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import type { DepthOfFieldEffect } from "postprocessing";

/* --- tweakable grade ------------------------------------------------------
 * Motion-driven depth-of-field: at rest the gallery is fully SHARP (bokehScale
 * 0). While the user pans (drag + inertia), `motionRef` rises 0→1 and we scale
 * the bokeh up, so the periphery blurs only during movement and settles back to
 * crisp once it stops. Focus stays locked on the gallery center.
 */
const FOCUS_TARGET: [number, number, number] = [0, 0, 0]; // sharp at gallery center
const FOCUS_RANGE_REST = 0.5; // wide in-focus band at rest (everything crisp)
const FOCUS_RANGE_MOVE = 0.02; // tight band while moving (whole frame defocuses)
const MAX_BOKEH = 4; // blur strength at full pan speed

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const BLOOM_INTENSITY = 0.2;
const VIGNETTE_OFFSET = 0.32;
const VIGNETTE_DARKNESS = 0.82;

export default function Effects({
  enabled = true,
  motionRef,
}: {
  enabled?: boolean;
  motionRef?: { current: number };
}) {
  const dof = useRef<DepthOfFieldEffect>(null);

  useFrame(() => {
    if (dof.current) {
      const m = motionRef?.current ?? 0;
      dof.current.bokehScale = m * MAX_BOKEH;
      // shrink the sharp band as we move so the blur spreads across the frame
      dof.current.cocMaterial.focusRange = lerp(
        FOCUS_RANGE_REST,
        FOCUS_RANGE_MOVE,
        m,
      );
    }
  });

  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <DepthOfField
        ref={dof}
        target={FOCUS_TARGET}
        focusRange={FOCUS_RANGE_REST}
        bokehScale={0}
      />
      <Bloom
        intensity={BLOOM_INTENSITY}
        luminanceThreshold={0.65}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={VIGNETTE_OFFSET}
        darkness={VIGNETTE_DARKNESS}
      />
    </EffectComposer>
  );
}
