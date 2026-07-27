'use client';

// template.tsx se re-monte à CHAQUE navigation → fondu d'entrée global entre pages.
// (Le zoom caméra + crossfade des pages projet passent par-dessus, donc pas de conflit.)
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
