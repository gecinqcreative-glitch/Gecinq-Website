import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Prendre rendez-vous avec GECINQ CREATIVE — studio créatif à Lausanne. Parle-nous de ton projet.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
