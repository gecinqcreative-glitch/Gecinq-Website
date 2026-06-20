import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/gallery/Logo";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "About — Gecinq",
  description: "Studio créatif audiovisuel — film, documentaire, podcast, branding.",
};

const SERVICES = [
  {
    k: "01",
    title: "Film & documentaire",
    body: "De l'écriture au montage : films de marque, documentaires et reportages.",
  },
  {
    k: "02",
    title: "Podcast & captation",
    body: "Conception, tournage multicam et habillage de formats audio/vidéo.",
  },
  {
    k: "03",
    title: "Branding & motion",
    body: "Identités de marque, génériques et motion design pour l'écran.",
  },
  {
    k: "04",
    title: "Direction artistique",
    body: "Une vision cohérente, du concept jusqu'à la diffusion.",
  },
];

export default function AboutPage() {
  return (
    <main className="page">
      <header className="page-top">
        <Link href="/" className="ov-logo" aria-label="Gecinq — accueil">
          <Logo className="ov-logo-svg" />
        </Link>
        <Link href="/" className="page-back">
          ← Work
        </Link>
      </header>

      <section className="page-hero">
        <p className="page-eyebrow">À propos</p>
        <h1 className="page-h1">
          Studio créatif audiovisuel basé entre Lausanne&nbsp;&amp;
          Aix-en-Provence.
        </h1>
        <p className="page-lead">
          Gecinq imagine et réalise des films, documentaires, podcasts et
          identités visuelles. On raconte des histoires qui se regardent —
          du concept à la diffusion.
        </p>
      </section>

      <section className="page-section">
        <h2 className="page-h2">Ce qu&apos;on fait</h2>
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <article key={s.k} className="svc-card">
              <span className="svc-k">{s.k}</span>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-body">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <h2 className="page-h2">Projets récents</h2>
        <ul className="proj-list">
          {projects.slice(0, 6).map((p) => (
            <li key={p.id}>
              <Link href={`/work/${p.slug}`} className="proj-row">
                <span className="proj-name">{p.title}</span>
                <span className="proj-cat">{p.category}</span>
                <span className="proj-go" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="page-cta">
        <h2 className="page-h2">Un projet en tête&nbsp;?</h2>
        <Link href="/contact" className="cta-btn">
          Parlons-en →
        </Link>
      </section>
    </main>
  );
}
