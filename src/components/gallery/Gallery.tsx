"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { projects, type Project } from "@/data/projects";
import { coverFit, loadPoster, makeAccentTexture } from "@/lib/textures";

// --- camera / layout constants (world units) ------------------------------
const FOV = 45;
const CAM_DIST = 6;
const VIS_H = 2 * Math.tan((FOV * Math.PI) / 360) * CAM_DIST; // visible height @ z=0

const TILE_W = 2.7;
const TILE_H = 1.68;
const PLANE_ASPECT = TILE_W / TILE_H; // for cover-fitting media without stretch
const CELL_W = 3.15;
const CELL_H = 2.15;
const CURVE_K = 0.045; // concave bowl strength: z = -(x²+y²)*k
const HOVER_LIFT = 0.7; // how far a hovered tile pops toward the camera
const HOVER_SCALE = 1.06;
const DRAG_DAMP = 0.92; // inertia decay per frame
const FOLLOW = 0.12; // lerp of current pan toward target
const MOTION_FULL = 0.18; // pan speed (world units/frame) that maps to full blur
const MOTION_ATTACK = 0.35; // ramp-up rate of motion blur
const MOTION_RELEASE = 0.06; // ramp-down rate (slower → trailing blur)

const mod = (n: number, m: number) => ((n % m) + m) % m;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Slot = {
  hovered: boolean;
  bright: number; // current material brightness
  scale: number; // current scale
  lift: number; // current z lift
  contentIndex: number; // which project this slot currently shows
  project: Project | null;
};

type ActiveVideo = {
  idx: number;
  video: HTMLVideoElement;
  tex: THREE.VideoTexture;
  onPlay: () => void;
};

export default function Gallery({
  onHover,
  motionRef,
}: {
  onHover: (project: Project | null) => void;
  /** Written each frame with normalized pan speed (0 idle → 1 fast). */
  motionRef?: { current: number };
}) {
  const { camera, gl } = useThree();
  const router = useRouter();
  const N = projects.length;

  // Grid sized once from the viewport aspect — big enough to cover the screen
  // plus margin for curvature & wrapping. Narrow screens naturally show fewer
  // columns (the rest wrap off-screen).
  const [{ cols, rows, count }] = useState(() => {
    const aspect =
      typeof window !== "undefined"
        ? window.innerWidth / window.innerHeight
        : 16 / 9;
    const visW = VIS_H * aspect;
    const c = Math.min(16, Math.max(4, Math.ceil(visW / CELL_W) + 4));
    const r = Math.min(12, Math.max(4, Math.ceil(VIS_H / CELL_H) + 4));
    return { cols: c, rows: r, count: c * r };
  });

  // Mutable, non-reactive state — kept in refs so per-frame mutation never
  // triggers React re-renders. Initialized in effects (never read at render).
  const postersRef = useRef<THREE.Texture[]>([]);
  const slotsRef = useRef<Slot[]>([]);
  const meshes = useRef<THREE.Mesh[]>([]);

  const pan = useRef({ x: 0, y: 0 });
  const prevPan = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const hoveredSlot = useRef(-1);
  const active = useRef<ActiveVideo | null>(null);

  // posters: procedural placeholders first, upgraded to real images if present
  useEffect(() => {
    const posters: THREE.Texture[] = projects.map((p, i) =>
      makeAccentTexture(p.accent, p.title, p.category, i),
    );
    postersRef.current = posters;
    let cancelled = false;
    projects.forEach((p, i) => {
      loadPoster(p.poster, PLANE_ASPECT)
        .then((tex) => {
          if (cancelled) return;
          posters[i].dispose();
          posters[i] = tex;
        })
        .catch(() => {
          /* keep the accent placeholder */
        });
    });
    return () => {
      cancelled = true;
      posters.forEach((t) => t.dispose());
    };
  }, []);

  // per-slot animation state, (re)built when the grid size changes
  useEffect(() => {
    slotsRef.current = Array.from({ length: count }, () => ({
      hovered: false,
      bright: 0.82,
      scale: 1,
      lift: 0,
      contentIndex: -1,
      project: null,
    }));
  }, [count]);

  // --- video management ---------------------------------------------------
  const stopActiveVideo = () => {
    const a = active.current;
    if (!a) return;
    a.video.removeEventListener("playing", a.onPlay);
    a.video.pause();
    a.video.removeAttribute("src");
    a.video.load();
    a.tex.dispose();
    active.current = null;
  };

  const startVideo = (idx: number) => {
    const proj = slotsRef.current[idx]?.project;
    if (!proj) return;
    stopActiveVideo(); // only one video plays at a time
    const video = document.createElement("video");
    video.src = proj.video;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    // cover-fit once the real video dimensions are known (no stretch)
    video.addEventListener(
      "loadedmetadata",
      () => coverFit(tex, video.videoWidth, video.videoHeight, PLANE_ASPECT),
      { once: true },
    );
    const onPlay = () => {
      const m = meshes.current[idx];
      if (m && slotsRef.current[idx]?.hovered) {
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.map = tex;
        mat.needsUpdate = true;
      }
    };
    video.addEventListener("playing", onPlay);
    video.play().catch(() => {
      /* autoplay blocked or file missing → poster stays */
    });
    active.current = { idx, video, tex, onPlay };
  };

  const clearHover = (idx: number) => {
    const s = slotsRef.current[idx];
    if (!s) return;
    s.hovered = false;
    if (active.current?.idx === idx) stopActiveVideo();
  };

  const handleOver = (idx: number) => {
    if (dragging.current) return;
    if (hoveredSlot.current === idx) return;
    const s = slotsRef.current[idx];
    if (!s) return;
    clearHover(hoveredSlot.current);
    hoveredSlot.current = idx;
    s.hovered = true;
    startVideo(idx);
    onHover(s.project);
  };

  const handleOut = (idx: number) => {
    if (hoveredSlot.current !== idx) return;
    clearHover(idx);
    hoveredSlot.current = -1;
    onHover(null);
  };

  // --- drag, inertia & click (DOM listeners on the canvas) ----------------
  useEffect(() => {
    const el = gl.domElement;
    let down = false;
    let last = { x: 0, y: 0 };
    let movedDist = 0;
    // world units per CSS pixel (uniform on both axes for a perspective cam)
    const wpp = () => VIS_H / el.clientHeight;
    let pressed = -1; // tile under the pointer when the press started

    const onDown = (e: PointerEvent) => {
      down = true;
      dragging.current = true;
      movedDist = 0;
      last = { x: e.clientX, y: e.clientY };
      vel.current = { x: 0, y: 0 };
      pressed = hoveredSlot.current; // remember it before clearing hover
      clearHover(hoveredSlot.current); // dragging cancels hover
      hoveredSlot.current = -1;
      onHover(null);
      el.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      movedDist += Math.hypot(dx, dy);
      last = { x: e.clientX, y: e.clientY };
      const k = wpp();
      const wx = dx * k;
      const wy = -dy * k; // screen Y is inverted vs world Y
      target.current.x += wx;
      target.current.y += wy;
      vel.current = { x: wx, y: wy };
    };

    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      dragging.current = false;
      el.releasePointerCapture?.(e.pointerId);
      // treat as a click (not a drag) if the pointer barely moved
      if (movedDist < 6 && pressed >= 0) {
        const proj = slotsRef.current[pressed]?.project;
        if (proj) router.push(`/work/${proj.slug}`);
      }
      pressed = -1;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, router]);

  // dispose any playing video on unmount
  useEffect(() => () => stopActiveVideo(), []);

  // --- per-frame update ---------------------------------------------------
  useFrame(() => {
    const slots = slotsRef.current;
    const posters = postersRef.current;
    if (slots.length !== count || posters.length !== N) return;

    if (!dragging.current) {
      target.current.x += vel.current.x;
      target.current.y += vel.current.y;
      vel.current.x *= DRAG_DAMP;
      vel.current.y *= DRAG_DAMP;
      if (Math.abs(vel.current.x) < 1e-4) vel.current.x = 0;
      if (Math.abs(vel.current.y) < 1e-4) vel.current.y = 0;
    }
    pan.current.x = lerp(pan.current.x, target.current.x, FOLLOW);
    pan.current.y = lerp(pan.current.y, target.current.y, FOLLOW);

    // motion amount → drives blur only while the gallery is moving
    if (motionRef) {
      const speed = Math.hypot(
        pan.current.x - prevPan.current.x,
        pan.current.y - prevPan.current.y,
      );
      const raw = Math.min(speed / MOTION_FULL, 1);
      const rate = raw > motionRef.current ? MOTION_ATTACK : MOTION_RELEASE;
      motionRef.current = lerp(motionRef.current, raw, rate);
    }
    prevPan.current.x = pan.current.x;
    prevPan.current.y = pan.current.y;

    const totalW = cols * CELL_W;
    const totalH = rows * CELL_H;
    const anyHover = hoveredSlot.current >= 0;

    for (let idx = 0; idx < count; idx++) {
      const m = meshes.current[idx];
      if (!m) continue;
      const s = slots[idx];
      const i = idx % cols;
      const j = Math.floor(idx / cols);

      // wrapped position (infinite scroll on both axes)
      const rawX = i * CELL_W + pan.current.x;
      const px = mod(rawX + totalW / 2, totalW) - totalW / 2;
      const kx = Math.round((rawX - px) / totalW);
      const worldCol = i + kx * cols;

      const rawY = j * CELL_H + pan.current.y;
      const py = mod(rawY + totalH / 2, totalH) - totalH / 2;
      const ky = Math.round((rawY - py) / totalH);
      const worldRow = j + ky * rows;

      // stable, scattered content per world cell
      const contentIndex = mod(worldCol * 31 + worldRow * 97, N);
      if (contentIndex !== s.contentIndex) {
        s.contentIndex = contentIndex;
        s.project = projects[contentIndex];
      }

      // concave bowl + face the camera
      s.lift = lerp(s.lift, s.hovered ? HOVER_LIFT : 0, 0.15);
      const z = -(px * px + py * py) * CURVE_K + s.lift;
      m.position.set(px, py, z);
      m.lookAt(camera.position);

      s.scale = lerp(s.scale, s.hovered ? HOVER_SCALE : 1, 0.15);
      m.scale.setScalar(s.scale);

      const mat = m.material as THREE.MeshBasicMaterial;
      // posters track content unless a video is showing on the hovered tile
      if (!s.hovered && mat.map !== posters[contentIndex]) {
        mat.map = posters[contentIndex];
        mat.needsUpdate = true;
      }
      const targetBright = s.hovered ? 1 : anyHover ? 0.42 : 0.82;
      s.bright = lerp(s.bright, targetBright, 0.1);
      mat.color.setScalar(s.bright);
    }
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) meshes.current[idx] = el;
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            handleOver(idx);
          }}
          onPointerOut={() => handleOut(idx)}
        >
          <planeGeometry args={[TILE_W, TILE_H]} />
          <meshBasicMaterial toneMapped={false} color="#d0d0d0" />
        </mesh>
      ))}
    </group>
  );
}
