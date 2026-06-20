"use client";

import { useEffect, useState } from "react";
import { projects } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Phase = "in" | "out" | "done";
const SESSION_KEY = "gecinq-splash-seen";

/**
 * First-load splash: the GECINQ CREATIVE mark drawn with stroke-dashoffset,
 * then the wordmark fades in, then the whole thing fades/scales out to reveal
 * the gallery. Shown once per session. Respects prefers-reduced-motion.
 */
export default function Splash() {
  const [phase, setPhase] = useState<Phase>("in");
  const reduced = useReducedMotion();

  useEffect(() => {
    // already shown this session → dismiss on the next tick (no flash of replay)
    if (sessionStorage.getItem(SESSION_KEY)) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // quietly warm the poster cache for a smooth reveal
    projects.forEach((p) => {
      const img = new Image();
      img.src = p.poster;
    });

    const holdMs = isReduced ? 800 : 2700;
    const outMs = isReduced ? 500 : 600;
    const t1 = setTimeout(() => setPhase("out"), holdMs);
    const t2 = setTimeout(() => setPhase("done"), holdMs + outMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`splash ${phase === "out" ? "is-out" : ""} ${
        reduced ? "reduced" : ""
      }`}
      aria-hidden="true"
    >
      <div className="splash-logo">
        <svg className="splash-mark" viewBox="0 0 200 172" fill="none">
          <rect
            className="dl dl-rect"
            x="8"
            y="8"
            width="184"
            height="92"
            pathLength={100}
          />
          <circle
            className="dl dl-circ"
            cx="100"
            cy="100"
            r="62"
            pathLength={100}
          />
        </svg>
        <div className="splash-word">
          <span>GECINQ</span>
          <span>CREATIVE</span>
        </div>
      </div>
    </div>
  );
}
