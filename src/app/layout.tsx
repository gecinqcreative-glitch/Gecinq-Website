import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import './globals.css';
import Nav from '@/components/ui/Nav';
import Splash from '@/components/ui/Splash';
import TransitionOverlay from '@/components/ui/TransitionOverlay';
import Chrome from '@/components/ui/Chrome';
import Cursor from '@/components/ui/Cursor';
import NoPullToRefresh from '@/components/ui/NoPullToRefresh';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: '%s — GECINQ CREATIVE',
  },
  description: SITE.description,
  keywords: [
    'studio créatif',
    'Lausanne',
    'direction artistique',
    'branding',
    'motion design',
    'web',
    'vidéo',
    'GECINQ CREATIVE',
  ],
  authors: [{ name: 'GECINQ CREATIVE' }],
  openGraph: {
    type: 'website',
    locale: 'fr_CH',
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-paper text-ink font-sans antialiased">
        {/* Splash d'intro : logo blanc sur fond noir, en fondu */}
        <Splash />
        {/* Overlay de transition shared-element tuile → page projet */}
        <TransitionOverlay />
        {/* Nav 2D fixe, présente sur toutes les pages */}
        <Nav />
        {/* Surcouche esthétique (grain + vignette + labels), non-interactive */}
        <Chrome />
        {/* Curseur personnalisé (desktop) */}
        <Cursor />
        {/* Renfort anti pull-to-refresh (tactile) */}
        <NoPullToRefresh />
        {children}
      </body>
    </html>
  );
}
