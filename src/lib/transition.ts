'use client';

import { useSyncExternalStore } from 'react';
import * as THREE from 'three';

export type Vec3 = [number, number, number];

// Cible caméra pour cadrer une tuile DE FACE, plein cadre (fin du dolly).
// On place la caméra sur la normale du plan, à la distance qui remplit heroVhFrac
// de la hauteur du viewport (même cadrage que le hero DOM → crossfade sans saut).
export function cameraTargetForTile(
  mesh: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
  heroVhFrac: number,
): { camPos: Vec3; camLook: Vec3 } {
  const q = mesh.getWorldQuaternion(new THREE.Quaternion());
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(q).normalize();
  const pos = mesh.getWorldPosition(new THREE.Vector3());
  const worldH = mesh.scale.y; // géométrie 1×1 → hauteur monde = scale.y
  const vFov = (camera.fov * Math.PI) / 180;
  const dist = worldH / 2 / (Math.tan(vFov / 2) * heroVhFrac);
  const camPos = pos.clone().addScaledVector(normal, dist);
  return { camPos: [camPos.x, camPos.y, camPos.z], camLook: [pos.x, pos.y, pos.z] };
}

// ─────────────────────────────────────────────────────────────────────────────
// Store de transition (partagé galerie ↔ overlay DOM).
// ─────────────────────────────────────────────────────────────────────────────
export type TransitionState = {
  phase: 'idle' | 'active';
  mode: 'zoom' | 'fade'; // zoom = caméra 3D (desktop) ; fade = crossfade simple (mobile)
  slug: string | null;
  cover: string | null;
  camPos: Vec3 | null;
  camLook: Vec3 | null;
  t0: number; // timestamp du début (ms)
};

const IDLE: TransitionState = {
  phase: 'idle',
  mode: 'zoom',
  slug: null,
  cover: null,
  camPos: null,
  camLook: null,
  t0: 0,
};
let state: TransitionState = IDLE;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function startProjectTransition(p: {
  slug: string;
  cover: string;
  mode: 'zoom' | 'fade';
  camPos: Vec3 | null;
  camLook: Vec3 | null;
}) {
  state = { phase: 'active', t0: performance.now(), ...p };
  emit();
}
export function endTransition() {
  state = IDLE;
  emit();
}
const getSnapshot = () => state;
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
export function useTransition() {
  return useSyncExternalStore(subscribe, getSnapshot, () => IDLE);
}
