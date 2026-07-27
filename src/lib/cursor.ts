'use client';

import { useSyncExternalStore } from 'react';

// Mode du curseur personnalisé : point simple, "lien", ou "VOIR" (survol tuile).
export type CursorMode = 'default' | 'link' | 'view';

let mode: CursorMode = 'default';
const listeners = new Set<() => void>();

export function setCursor(m: CursorMode) {
  if (m === mode) return;
  mode = m;
  listeners.forEach((l) => l());
}

export function useCursor() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => mode,
    () => 'default' as CursorMode,
  );
}
