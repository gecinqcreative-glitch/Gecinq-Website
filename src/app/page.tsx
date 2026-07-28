'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import IndexView from '@/components/ui/IndexView';
import Magnetic from '@/components/ui/Magnetic';
import SwipeHint from '@/components/ui/SwipeHint';

// Scene = WebGL pur → jamais rendu côté serveur
const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function Home() {
  // par défaut on suppose WebGL ; on vérifie au montage (sinon fallback INDEX)
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);

  return (
    <main className="splash-reveal relative min-h-screen w-full bg-paper">
      {webgl ? <Scene /> : <IndexView />}
      {webgl && <SwipeHint />}

      {/* CTA proéminent + magnétique */}
      <Magnetic className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 rounded-none bg-ink px-5 py-3 text-xs font-medium uppercase tracking-[0.02em] text-paper shadow-[0_12px_40px_rgba(0,0,0,0.55)] ring-1 ring-white/10 transition-opacity duration-200 hover:opacity-90 sm:gap-3 sm:px-8 sm:py-4 sm:text-sm"
        >
          Prendre RDV avec nous
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Magnetic>
    </main>
  );
}
