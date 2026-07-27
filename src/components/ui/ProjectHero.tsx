'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { TRANSITION } from '@/lib/heroLayout';
import SplitText from './SplitText';

/**
 * Hero de la page projet : plein cadre (même cadrage que le crossfade → continuité),
 * bloc titre en stagger, + léger PARALLAX au scroll (l'image dérive/zoome doucement)
 * pour un rendu vivant. Au scroll 0 : aucune transform → raccord parfait.
 */
export default function ProjectHero({
  cover,
  title,
  category,
  year,
}: {
  cover: string;
  title: string;
  category: string;
  year: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = imgRef.current;
        if (!el) return;
        const y = Math.min(window.scrollY, window.innerHeight);
        el.style.transform = `translateY(${y * -0.12}px) scale(${1 + Math.min(y / 2600, 0.06)})`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden px-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={cover}
        alt={title}
        className="w-auto max-w-[92vw] object-contain will-change-transform"
        style={{ height: `${TRANSITION.heroVh}vh` }}
      />

      {/* dégradé + bloc titre (stagger) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-paper via-paper/60 to-transparent" />
      <div className="absolute bottom-[8vh] left-5 right-5 mx-auto max-w-6xl md:left-8">
        <div
          className="rise caps text-[11px] text-ink/60"
          style={{ animationDelay: '60ms' }}
        >
          {category}
        </div>
        <h1 className="mt-3 text-5xl font-bold uppercase leading-[0.92] tracking-[-0.04em] md:text-8xl">
          <SplitText text={title} delay={140} />
        </h1>
        <div
          className="rise caps mt-4 text-[11px] text-ink/45"
          style={{ animationDelay: '200ms' }}
        >
          {year}
        </div>
      </div>

      <Link
        href="/"
        className="rise caps absolute left-5 top-28 text-[10px] text-ink/40 transition-colors hover:text-ink md:left-8"
        style={{ animationDelay: '60ms' }}
      >
        ← Index
      </Link>
    </section>
  );
}
