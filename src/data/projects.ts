export type Project = {
  id: number;
  title: string;
  category: string;
  slug: string;
  /** Static image shown by default (first paint, good LCP). */
  poster: string;
  /** Preview clip played on hover (muted/loop). */
  video: string;
  /** Accent color used for placeholder tiles and UI hints. */
  accent: string;
};

/**
 * Real portfolio projects. Media lives in /public/projects/<slug>.{jpg,mp4}
 * (posters + short, web-optimized preview clips). Missing files degrade
 * gracefully to a procedural accent poster (see lib/textures.ts).
 */
export const projects: Project[] = [
  {
    id: 1,
    title: "Poz",
    category: "Podcast · Architecture · DCA Lab",
    slug: "poz-dca-lab",
    poster: "/projects/poz-dca-lab.jpg",
    video: "/projects/poz-dca-lab.mp4",
    accent: "#E8523F",
  },
  {
    id: 2,
    title: "Lausanne → Aix",
    category: "Documentaire cycliste · 800 km",
    slug: "doc-cycliste",
    poster: "/projects/doc-cycliste.jpg",
    video: "/projects/doc-cycliste.mp4",
    accent: "#2D8C7F",
  },
  {
    id: 3,
    title: "Animalia",
    category: "Film · Vaudoise Assurances",
    slug: "animalia-vaudoise",
    poster: "/projects/animalia-vaudoise.jpg",
    video: "/projects/animalia-vaudoise.mp4",
    accent: "#C9A24B",
  },
  {
    id: 4,
    title: "École 42",
    category: "Reportage · Formation",
    slug: "ecole-42",
    poster: "/projects/ecole-42.jpg",
    video: "/projects/ecole-42.mp4",
    accent: "#3B6FE0",
  },
  {
    id: 5,
    title: "VISION·S",
    category: "Branding · Cinéma",
    slug: "visions",
    poster: "/projects/visions.jpg",
    video: "/projects/visions.mp4",
    accent: "#8A4FE0",
  },
  {
    id: 6,
    title: "Joe Coaching",
    category: "Podcast · Coaching",
    slug: "joe-coaching",
    poster: "/projects/joe-coaching.jpg",
    video: "/projects/joe-coaching.mp4",
    accent: "#D14F8A",
  },
  {
    id: 7,
    title: "Map.ch",
    category: "Plateforme · Contenu",
    slug: "map-ch",
    poster: "/projects/map-ch.jpg",
    video: "/projects/map-ch.mp4",
    accent: "#4FB0D1",
  },
  {
    id: 8,
    title: "GoodLo",
    category: "Film · Follow the Flow",
    slug: "goodlo",
    poster: "/projects/goodlo.jpg",
    video: "/projects/goodlo.mp4",
    accent: "#5FBF6A",
  },
  {
    id: 9,
    title: "Flirty IQ",
    category: "Social · FlirtyIQ",
    slug: "flirty-iq",
    poster: "/projects/flirty-iq.jpg",
    video: "/projects/flirty-iq.mp4",
    accent: "#E0557A",
  },
  {
    id: 10,
    title: "Danse",
    category: "Clip · Motion",
    slug: "danse",
    poster: "/projects/danse.jpg",
    video: "/projects/danse.mp4",
    accent: "#B0653F",
  },
  {
    id: 11,
    title: "À Pleines Papilles",
    category: "Branding · Festival culinaire",
    slug: "a-pleines-papilles",
    // recreated logo poster (SVG) — replace with the real .jpg/.mp4 when ready
    poster: "/projects/a-pleines-papilles.svg",
    video: "/projects/a-pleines-papilles.mp4",
    accent: "#EC4960",
  },
  {
    id: 12,
    title: "Facet Bloom",
    category: "Branding · Creative Space",
    slug: "facet-bloom",
    // recreated logo poster (SVG) — replace with the real .jpg/.mp4 when ready
    poster: "/projects/facet-bloom.svg",
    video: "/projects/facet-bloom.mp4",
    accent: "#E5241B",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
