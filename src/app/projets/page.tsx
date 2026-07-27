import type { Metadata } from 'next';
import IndexView from '@/components/ui/IndexView';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Projets',
  description:
    'Tous les projets de GECINQ CREATIVE — identité de marque, web, social media, motion et édition.',
};

export default function ProjetsPage() {
  return (
    <main className="min-h-screen bg-paper">
      <IndexView />
      <Footer />
    </main>
  );
}
