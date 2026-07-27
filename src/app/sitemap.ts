import type { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/projects';
import { SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ['', '/qui-nous-sommes', '/contact', '/projets'].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
  }));
  const projects = PROJECTS.map((p) => ({
    url: `${SITE.url}/projects/${p.slug}`,
    lastModified: now,
  }));
  return [...pages, ...projects];
}
