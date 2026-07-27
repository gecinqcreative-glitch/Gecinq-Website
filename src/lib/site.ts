// Infos globales du site (SEO / partage). L'URL passe en variable d'env au déploiement.
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gecinqcreative.com',
  name: 'GECINQ CREATIVE',
  title: 'GECINQ CREATIVE — Studio créatif, Lausanne',
  description:
    'Studio créatif basé à Lausanne : direction artistique, vidéo, web, branding et motion design. Un duo, une exigence partagée.',
};
