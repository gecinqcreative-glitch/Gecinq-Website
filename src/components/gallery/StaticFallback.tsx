"use client";

import Link from "next/link";
import { projects } from "@/data/projects";
import Logo from "./Logo";

/**
 * prefers-reduced-motion fallback: a plain scrollable poster grid.
 * No WebGL, no autoplay — just posters (with an accent background behind them
 * in case the image is missing). Same routing to /work/[slug].
 */
export default function StaticFallback() {
  return (
    <div className="fallback">
      <header className="fb-top">
        <Link href="/" className="ov-logo" aria-label="Gecinq — accueil">
          <Logo className="ov-logo-svg" />
        </Link>
        <Link href="/contact" className="ov-btn">
          Let&apos;s Talk
        </Link>
      </header>
      <h1 className="fb-h1">Selected Work</h1>
      <div className="fb-grid">
        {projects.map((p) => (
          <a
            key={p.id}
            href={`/work/${p.slug}`}
            className="fb-card"
            style={{ background: p.accent }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.poster}
              alt={p.title}
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility =
                  "hidden";
              }}
            />
            <div className="fb-meta">
              <span className="fb-cat">{p.category}</span>
              <span className="fb-title">{p.title}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
