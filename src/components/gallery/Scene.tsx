"use client";

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { Project } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import Gallery from "./Gallery";
import Effects from "./Effects";
import Overlay from "./Overlay";
import Cursor from "./Cursor";
import StaticFallback from "./StaticFallback";

/**
 * Immersive 3D project gallery.
 * - Default: WebGL bowl-grid (drag, inertia, infinite scroll, hover video).
 * - Touch / small screens & prefers-reduced-motion: native-scrolling poster grid.
 */
export default function Scene() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [hovered, setHovered] = useState<Project | null>(null);
  // shared 0→1 pan-speed signal: Gallery writes it, Effects reads it for blur
  const motion = useRef(0);
  // disable heavy post-processing (DoF) on low-core machines
  const [postOn] = useState(() => {
    if (typeof navigator === "undefined") return true;
    return (navigator.hardwareConcurrency || 8) >= 4;
  });

  // The 3D gallery relies on hover; on touch / small screens serve the grid.
  if (reduced || mobile) return <StaticFallback />;

  return (
    <>
      <div className="stage">
        <Canvas
          flat
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          // tight near/far keeps DepthOfField's normalized focus range intuitive
          camera={{ position: [0, 0, 6], fov: 45, near: 3, far: 18 }}
          onCreated={({ gl }) => gl.setClearColor("#000000", 1)}
        >
          <Gallery onHover={setHovered} motionRef={motion} />
          <Effects enabled={postOn} motionRef={motion} />
        </Canvas>
      </div>
      <Overlay />
      <Cursor project={hovered} />
    </>
  );
}
