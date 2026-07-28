"use client";

import { useEffect, useState } from "react";

/**
 * True on touch / small-viewport devices, where the WebGL drag-gallery (which
 * relies on hover) is a poor fit and a native-scrolling grid is served instead.
 * SSR-safe: false on the server, resolved on the client after mount.
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    // coarse pointer (no real hover) OR a narrow viewport
    const mq = window.matchMedia("(max-width: 820px), (pointer: coarse)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}
