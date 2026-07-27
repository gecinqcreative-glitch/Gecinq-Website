'use client';

import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';

/**
 * Splash d'intro : logo blanc sur fond noir + COMPTEUR DE CHARGEMENT réel
 * (basé sur le chargement des textures via drei useProgress). Fondu de sortie
 * une fois les assets prêts (avec un minimum d'affichage).
 */
export default function Splash() {
  const { progress, total } = useProgress();
  const live = useRef({ progress, total });
  live.current = { progress, total };

  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    let finished = false;
    const loop = () => {
      const el = performance.now() - t0;
      const ramp = Math.min(94, (el / 1500) * 94); // montée douce 0→94
      const real =
        live.current.total > 0 ? live.current.progress : el > 1100 ? 100 : 0;
      setPct(Math.round(Math.min(100, Math.max(ramp, real))));

      const ready =
        (live.current.total > 0 ? live.current.progress >= 100 : el > 1100) &&
        el > 1300;
      if (ready && !finished) {
        finished = true;
        setPct(100);
        setTimeout(() => setLeaving(true), 300);
        setTimeout(() => setDone(true), 300 + 1400);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  if (done) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-white.png"
        alt="GECINQ CREATIVE"
        className="h-32 w-auto animate-[fadeIn_1300ms_ease-out] sm:h-44 md:h-56"
      />
      <div className="mt-10 text-[11px] tabular-nums tracking-[0.35em] text-white/55">
        {String(pct).padStart(3, '0')}
      </div>
    </div>
  );
}
