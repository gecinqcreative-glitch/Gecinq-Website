"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

/** HTML chrome layered over the canvas. pointer-events pass through except on controls. */
export default function Overlay() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="overlay">
      {/* top bar */}
      <header className="ov-top">
        <Link href="/" className="ov-logo" aria-label="Gecinq — accueil">
          <Logo className="ov-logo-svg" />
        </Link>
        <Link href="/contact" className="ov-btn">
          Let&apos;s Talk
        </Link>
      </header>

      {/* bottom-left: grid / list toggle */}
      <div className="ov-bl">
        <button
          className={`ov-tog ${view === "grid" ? "on" : ""}`}
          onClick={() => setView("grid")}
          aria-label="Vue grille"
        >
          Grid
        </button>
        <span className="ov-sep">/</span>
        <button
          className={`ov-tog ${view === "list" ? "on" : ""}`}
          onClick={() => setView("list")}
          aria-label="Vue liste"
        >
          List
        </button>
      </div>

      {/* bottom-center: nav pill */}
      <nav className="ov-pill">
        <Link className="on" href="/">
          Work
        </Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      {/* bottom-right: filter */}
      <button className="ov-filter">Filter +</button>

      {/* drag hint */}
      <div className="ov-hint">Drag to explore — click to open</div>
    </div>
  );
}
