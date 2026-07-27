import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROJECTS, getProject } from '@/data/projects';
import ProjectHero from '@/components/ui/ProjectHero';
import Reveal from '@/components/ui/Reveal';
import Footer from '@/components/ui/Footer';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = getProject(params.slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.category}`,
    description: p.intro,
    openGraph: {
      title: `${p.title} — GECINQ CREATIVE`,
      description: p.intro,
      images: [p.cover],
    },
    twitter: { card: 'summary_large_image', images: [p.cover] },
  };
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();
  const next = getProject(project.nextSlug);

  return (
    <main className="relative min-h-screen w-full bg-paper">
      <ProjectHero
        cover={project.cover}
        title={project.title}
        category={project.category}
        year={project.year}
      />

      <div className="mx-auto max-w-6xl px-5 pb-40 pt-24 md:px-8">
        {/* Texte du projet (accroche + corps), révélé au scroll */}
        <div className="max-w-2xl">
          <Reveal as="p" className="text-lg leading-relaxed text-ink/85 md:text-xl">
            {project.intro}
          </Reveal>
          {project.body?.map((para, i) => (
            <Reveal
              key={i}
              as="p"
              delay={80}
              className="mt-6 text-sm leading-relaxed text-ink/60 md:text-base"
            >
              {para}
            </Reveal>
          ))}
        </div>

        {/* Galerie — mosaïque en colonnes (masonry), visuels à taille raisonnable */}
        {project.gallery.length > 0 && (
          <section className="mt-28">
            <Reveal className="caps mb-8 text-[10px] text-ink/40">Aperçu</Reveal>
            <div
              className={`gap-5 [column-fill:_balance] ${
                project.gallery.length >= 5
                  ? 'columns-2 md:columns-3'
                  : 'columns-1 sm:columns-2'
              }`}
            >
              {project.gallery.map((src, i) => (
                <Reveal
                  key={src}
                  as="figure"
                  delay={(i % 3) * 80}
                  className="mb-5 overflow-hidden break-inside-avoid"
                >
                  <img
                    src={src}
                    alt={`${project.title} — ${i + 1}`}
                    loading="lazy"
                    className="w-full transition-transform duration-700 hover:scale-[1.03]"
                  />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {next && (
          <Reveal>
            <Link
              href={`/projects/${next.slug}`}
              className="group mt-40 flex items-center justify-between gap-6 border-t border-white/10 pt-10"
            >
              <div>
                <span className="caps text-[10px] text-ink/50">
                  Projet suivant
                </span>
                <div className="mt-2 text-3xl font-bold uppercase tracking-[-0.04em] transition-opacity group-hover:opacity-60 md:text-5xl">
                  {next.title}
                </div>
              </div>
              <div className="hidden h-24 w-20 shrink-0 overflow-hidden md:block">
                <img
                  src={next.cover}
                  alt={next.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
          </Reveal>
        )}
      </div>
      <Footer />
    </main>
  );
}
