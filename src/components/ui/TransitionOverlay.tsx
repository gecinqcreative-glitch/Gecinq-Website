'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition, endTransition } from '@/lib/transition';
import { TRANSITION } from '@/lib/heroLayout';

/**
 * Crossfade de fin de transition : quand le dolly caméra (ou le fallback) arrive,
 * on fond un cover plein cadre (MÊME cadrage que le hero de la page projet →
 * continuité) puis on navigue. Monté dans le layout → persiste pendant la nav.
 */
export default function TransitionOverlay() {
  const t = useTransition();
  const router = useRouter();
  const [covered, setCovered] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (t.phase !== 'active' || !t.slug) {
      setCovered(false);
      done.current = false;
      return;
    }
    done.current = false;
    const dur = t.mode === 'zoom' ? TRANSITION.zoomMs : TRANSITION.fadeMs;
    const coverAt = t.mode === 'zoom' ? TRANSITION.coverAt * dur : 0;

    const a = setTimeout(() => setCovered(true), coverAt);
    const b = setTimeout(() => {
      if (done.current) return;
      done.current = true;
      router.push(`/projects/${t.slug}`);
    }, dur);
    const c = setTimeout(() => endTransition(), dur + TRANSITION.holdMs);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, [t.phase, t.slug, t.mode, router]);

  if (t.phase !== 'active' || !t.cover) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-paper"
      style={{
        opacity: covered ? 1 : 0,
        transition: `opacity ${TRANSITION.coverFadeMs}ms ease-out`,
      }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={t.cover}
        alt=""
        className="w-auto max-w-[92vw] object-contain"
        style={{ height: `${TRANSITION.heroVh}vh` }}
      />
    </div>
  );
}
