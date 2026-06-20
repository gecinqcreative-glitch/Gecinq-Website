import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="work" style={{ ["--accent" as string]: project.accent }}>
      <Link href="/" className="work-back">
        ← Back
      </Link>

      <div className="work-hero">
        <video
          className="work-media"
          poster={project.poster}
          src={project.video}
          muted
          loop
          autoPlay
          playsInline
        />
      </div>

      <div className="work-info">
        <span className="work-cat">{project.category}</span>
        <h1 className="work-title">{project.title}</h1>
      </div>
    </main>
  );
}
