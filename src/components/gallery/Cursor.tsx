"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

/**
 * Custom cursor: a dot that grows over a tile and shows the project label.
 * Only on fine pointers (mouse) — hidden on touch.
 */
export default function Cursor({ project }: { project: Project | null }) {
  const dot = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!fine) return;
    document.body.classList.add("cursor-none");
    const onMove = (e: PointerEvent) => {
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.body.classList.remove("cursor-none");
    };
  }, [fine]);

  if (!fine) return null;
  const active = !!project;

  return (
    <div ref={dot} className="cursor-root">
      <div className={`cursor-dot ${active ? "is-active" : ""}`} />
      <div className={`cursor-label ${active ? "is-active" : ""}`}>
        {project && (
          <>
            <span className="cursor-title">{project.title}</span>
            <span className="cursor-cat">{project.category}</span>
          </>
        )}
      </div>
    </div>
  );
}
