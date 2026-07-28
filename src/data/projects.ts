export type GalleryItem = { src: string; r: number }; // r = largeur / hauteur

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  cover: string; // média de couverture (plan 3D + hero page projet)
  ratio: number; // largeur / hauteur du média (info)
  video?: string;
  intro: string; // paragraphe d'accroche
  body?: string[]; // corps de texte (paragraphes suivants)
  gallery: GalleryItem[];
  nextSlug: string;
};

const cover = (slug: string) => `/projects/${slug}/cover.jpg`;
const shot = (slug: string, n: number) =>
  `/projects/${slug}/${String(n).padStart(2, '0')}.jpg`;
// [numéro, ratio l/h] → item de galerie (le ratio aligne les rangées sans recadrer)
const shots = (slug: string, list: [number, number][]) =>
  list.map(([n, r]) => ({ src: shot(slug, n), r }));

export const PROJECTS: Project[] = [
  {
    slug: 'facet-bloom',
    title: 'Facet Bloom',
    category: 'Identité de marque',
    year: '2025',
    cover: cover('facet-bloom'),
    ratio: 0.8,
    intro:
      'Facet Bloom est une entité dédiée à l’organisation de concours artistiques et créatifs dans le domaine digital. L’objectif du projet était de développer une identité visuelle capable de représenter à la fois le processus de création, la progression des participants et la mise en valeur de leur travail.',
    body: [
      'Le concept graphique s’articule autour de deux symboles : la pierre précieuse et l’œil. La pierre évoque une créativité brute qui se façonne et se précise au fil du projet, jusqu’à révéler tout son potentiel. L’œil représente quant à lui la visibilité offerte aux créations à travers les concours, les expositions et les différents supports de communication.',
      'Cette identité a ensuite été déclinée sur plusieurs formats, notamment un magazine, des affiches de concours, un site web ainsi que des publications et stories pour les réseaux sociaux, afin de construire un univers cohérent, reconnaissable et adapté au digital.',
      'Ce projet est entièrement fictif et a été réalisé dans le cadre d’un exercice de design graphique.',
    ],
    gallery: shots('facet-bloom', [
      [1, 1.77],
      [2, 1.44],
      [3, 0.8],
      [4, 0.66],
    ]),
    nextSlug: 'map-ch',
  },
  {
    slug: 'map-ch',
    title: 'Map.ch',
    category: 'Web / Social media',
    year: '2024',
    cover: cover('map-ch'),
    ratio: 0.72,
    intro:
      'Map.ch accompagne des PME suisses dans leur présence digitale : sites web, réseaux sociaux et contenus. L’objectif — une communication claire, régulière et cohérente, adaptée à chaque métier.',
    body: [
      'Pour chaque client — OliMandats, Espace Pro Piscine, Seic, Swisspeaks… — on décline une identité en supports concrets : publications social media, visuels pédagogiques (« comment ça marche »), pages web et gabarits réutilisables.',
      'L’approche privilégie la lisibilité et la constance : un système graphique simple, des couleurs franches et des mises en page modulables, pour que la marque reste reconnaissable sur tous les canaux.',
    ],
    gallery: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => ({
      src: shot('map-ch', n),
      r: 1,
    })),
    nextSlug: 'flirtyiq',
  },
  {
    slug: 'flirtyiq',
    title: 'FlirtyIQ',
    category: 'Social media / IA',
    year: '2025',
    cover: cover('flirtyiq'),
    ratio: 0.8,
    intro:
      'Flirty est une application basée sur l’intelligence artificielle, destinée à un public jeune et intéressé par les nouvelles technologies. Son identité visuelle étant déjà définie, l’objectif du projet était de développer une communication cohérente et adaptée aux réseaux sociaux afin de présenter l’application, ses fonctionnalités et son univers.',
    body: [
      'Une dizaine de publications Instagram ont été conçues pour transmettre les informations de manière claire, dynamique et accessible. Six templates personnalisables ont également été créés afin de permettre à l’équipe de produire facilement et de manière autonome de nouveaux contenus, tout en conservant une identité visuelle reconnaissable et cohérente.',
    ],
    gallery: [1, 2, 3, 4, 5, 6].map((n) => ({
      src: shot('flirtyiq', n),
      r: 0.8,
    })),
    nextSlug: 'fva',
  },
  {
    slug: 'fva',
    title: 'FVA',
    category: 'Identité de marque',
    year: '2024',
    cover: cover('fva'),
    ratio: 0.8,
    intro:
      'Ce projet consistait à repenser l’identité visuelle de la FVA, une fondation vaudoise qui accompagne les personnes confrontées à des problèmes liés à l’alcool. L’objectif était de créer un logo transmettant un sentiment d’accueil, de soutien et de bienveillance, afin que chaque personne puisse se sentir accompagnée dès le premier contact.',
    body: [
      'Le concept graphique repose sur un pictogramme mêlant une route et un tournesol. La route symbolise le parcours, les difficultés traversées et le chemin vers un nouvel équilibre, tandis que le tournesol représente l’épanouissement, le renouveau et l’espoir après les épreuves.',
      'Cette identité a ensuite été développée sur différents supports, notamment un site web, des affiches, une charte graphique et des cartes de visite, afin de construire un univers cohérent, accessible et rassurant.',
    ],
    gallery: shots('fva', [
      [1, 1.5],
      [2, 1.5],
      [3, 1.5],
      [4, 0.8],
      [5, 1.5],
    ]),
    nextSlug: 'app',
  },
  {
    slug: 'app',
    title: 'À Pleines Papilles',
    category: 'Identité / Événement',
    year: '2024',
    cover: cover('app'),
    ratio: 0.8,
    intro:
      'À Pleines Papilles est un festival consacré à la cuisine gastronomique. L’objectif était de créer une identité visuelle à la fois haut de gamme et accessible, capable de transmettre la qualité de l’événement sans adopter une image trop élitiste.',
    body: [
      'Le concept graphique s’est développé autour de la sauce, élément central de la gastronomie et symbole de créativité, de mouvement et de gourmandise. Ses formes fluides ont permis de construire un univers visuel élégant, vivant et facilement reconnaissable.',
      'L’identité a ensuite été déclinée sur différents supports, notamment des affiches, des contenus pour les réseaux sociaux ainsi qu’un système de signalétique destiné à faciliter l’orientation des visiteurs au sein du festival.',
    ],
    gallery: shots('app', [
      [1, 1.5],
      [2, 1.37],
      [3, 0.97],
      [4, 0.8],
      [5, 1.15],
    ]),
    nextSlug: 'isao-mudac',
  },
  {
    slug: 'isao-mudac',
    title: 'ISAO — MUDAC',
    category: 'Affiche / Direction artistique',
    year: '2025',
    cover: cover('isao-mudac'),
    ratio: 0.8,
    intro:
      'Affiche fictive conçue à partir d’une exposition consacrée à Isao Takahata au mudac de Lausanne. L’objectif était de traduire son univers visuel, sensible et poétique à travers une proposition graphique forte.',
    body: [
      'Le travail s’est concentré sur la composition, la typographie et l’atmosphère générale afin de créer un visuel cohérent avec l’identité de l’exposition et l’œuvre du réalisateur.',
    ],
    gallery: [],
    nextSlug: 'goodlo',
  },
  {
    slug: 'goodlo',
    title: 'GoodLo',
    category: 'Motion / Réseaux',
    year: '2024',
    cover: cover('goodlo'),
    ratio: 1.79,
    intro:
      'GoodLo — direction motion pour les réseaux. Follow the flow : rythme, gradients et transitions léchées.',
    gallery: [],
    nextSlug: 'facet-bloom',
  },
];

export const getProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);
