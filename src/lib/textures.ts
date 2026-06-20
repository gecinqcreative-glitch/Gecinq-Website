import * as THREE from "three";

/** Lighten (amt>0) or darken (amt<0) a #rrggbb color. */
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) * (1 + amt));
  const g = clamp(((n >> 8) & 255) * (1 + amt));
  const b = clamp((n & 255) * (1 + amt));
  return `rgb(${r},${g},${b})`;
}

/**
 * Procedural placeholder poster: accent gradient + title/category text.
 * Always available (no network), so the grid renders fully even before the
 * real /public/projects assets exist. Replaced by the real poster when it loads.
 */
export function makeAccentTexture(
  accent: string,
  title: string,
  category: string,
  index: number,
): THREE.CanvasTexture {
  const W = 640;
  const H = 400;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, shade(accent, 0.12));
  g.addColorStop(1, shade(accent, -0.45));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // soft inner vignette for depth
  const rg = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H);
  rg.addColorStop(0, "rgba(0,0,0,0)");
  rg.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W, H);

  // index chip
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "600 22px ui-monospace, Menlo, monospace";
  ctx.fillText(String(index + 1).padStart(2, "0"), 36, 56);

  // category (mono, small)
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "500 18px ui-monospace, Menlo, monospace";
  ctx.fillText(category.toUpperCase(), 36, H - 70);

  // title (bold)
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 46px Helvetica, Arial, sans-serif";
  ctx.fillText(title, 34, H - 32);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Cover-fit a texture onto a plane of `planeAspect` (w/h): preserve the source
 * aspect ratio, fill the plane, crop the overflow, centered. No stretching.
 */
export function coverFit(
  tex: THREE.Texture,
  srcW: number,
  srcH: number,
  planeAspect: number,
) {
  if (!srcW || !srcH) return;
  const imgAspect = srcW / srcH;
  tex.center.set(0.5, 0.5);
  if (imgAspect > planeAspect) {
    tex.repeat.set(planeAspect / imgAspect, 1); // image too wide → crop sides
  } else {
    tex.repeat.set(1, imgAspect / planeAspect); // image too tall → crop top/bottom
  }
  tex.needsUpdate = true;
}

/** Try to load a real poster image (cover-fitted); rejects if the file is missing. */
export function loadPoster(
  url: string,
  planeAspect: number,
): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      coverFit(tex, img.naturalWidth || img.width, img.naturalHeight || img.height, planeAspect);
      resolve(tex);
    };
    img.onerror = () => reject(new Error(`poster 404: ${url}`));
    img.src = url;
  });
}
