import Link from 'next/link';
import SplitText from '@/components/ui/SplitText';
import Footer from '@/components/ui/Footer';

export const metadata = {
  title: 'Qui nous sommes — GECINQ CREATIVE',
};

const DUO = [
  {
    photo: '/about/member-1.jpg',
    name: 'Loïc Guniat',
    role: 'Bachelor professionnel · CEPV',
    bio: 'Bachelor professionnel au CEPV, aujourd’hui en cours de bachelor à l’ECAL pour approfondir ses connaissances. À côté du métier, sa passion c’est le culturisme — et un goût prononcé pour les belles choses.',
  },
  {
    photo: '/about/member-2.jpg',
    name: 'Anthony Da Costa',
    role: 'Bachelor professionnel · CEPV',
    bio: 'Bachelor professionnel au CEPV. En dehors du studio, c’est le sport qui l’anime, et particulièrement le triathlon.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-paper px-5 pb-32 pt-28 sm:pt-36 md:pt-44 md:px-8">
      <div className="enter mx-auto max-w-6xl">
        {/* Titre + intro */}
        <header>
          <div className="caps mb-3 text-[10px] text-ink/50">
            Qui nous sommes
          </div>
          <h1 className="max-w-5xl text-5xl font-bold uppercase leading-[0.95] tracking-[-0.04em] md:text-7xl">
            <SplitText text="Un studio créatif à Lausanne, à deux mains et quatre yeux." />
          </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60">
          GECINQ CREATIVE est un studio créatif basé à Lausanne, composé de deux
          personnes. On imagine et on fabrique des images, des marques et des
          expériences — de la direction artistique au montage, du web au motion.
          Un duo, un dialogue permanent, une exigence partagée.
        </p>
      </header>

      {/* Le duo */}
      <section className="mt-24">
        <div className="caps mb-8 text-[10px] text-ink/50">Le duo</div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10">
          {DUO.map((m) => (
            <figure key={m.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.photo}
                alt={m.name}
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="mt-4">
                <div className="text-xl font-bold uppercase tracking-[-0.04em]">
                  {m.name}
                </div>
                <div className="caps mt-1 text-[10px] text-ink/50">
                  {m.role}
                </div>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
                  {m.bio}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Lausanne + lien contact */}
      <section className="mt-28 border-t border-white/10 pt-10">
        <p className="text-sm text-ink/60">
          Basés à <span className="text-ink">Lausanne (Suisse)</span>, on
          travaille avec des clients d’ici et d’ailleurs.
        </p>
        <Link
          href="/contact"
          className="caps mt-6 inline-block rounded-none bg-ink px-6 py-3 text-[11px] text-paper transition-opacity hover:opacity-80"
        >
          Travailler avec nous →
        </Link>
      </section>
      </div>
      <Footer />
    </main>
  );
}
