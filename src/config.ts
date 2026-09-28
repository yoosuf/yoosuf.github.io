/** Site-wide constants. Central source of truth for URLs, nav, socials. */

export const SITE = {
  url: 'https://yoosuf.me',
  title: 'Yoosuf Mohamed',
  author: 'Yoosuf Mohamed',
  email: 'mayoosuf@gmail.com',
  description:
    'Systems Architect and AI engineer helping startups and enterprises build reliable AI automation, LLM/RAG products, and scalable software.',
  lang: 'en',
  locale: 'en_US',
  gaId: 'G-SJQ1MBM1PF',
  logo: '/assets/images/yoosuf.jpg',
  logoMark: '/assets/images/icon-512.png',
  socialImage: '/assets/images/social-card.jpg',
  date: { currentYear: new Date().getFullYear() },
} as const

export const NAV = [
  { name: 'Home', link: '/' },
  { name: 'Services', link: '/services/' },
  { name: 'Blog', link: '/blog/' },
  { name: 'About', link: '/about/' },
  { name: 'Contact', link: '/contact/' },
] as const

export const FOOTER_LINKS = {
  site: [
    ...NAV.map(({ name, link }) => ({ label: name, href: link })),
    { label: 'Profile', href: '/yoosuf/' },
  ],
  // Postwire and Messenger are `SoftwareApplication` entities in the schema.
  // They are not in the primary nav, so the footer is their only site-wide
  // inbound link — without it they are reachable only from the home page.
  // No per-link description here: both pages carry their own, and a second
  // copy in a 12rem column just wraps to three noisy lines.
  products: [
    { label: 'Postwire', href: '/postwire/' },
    { label: 'Messenger', href: '/messenger/' },
  ],
  // Direct ways to reach Yoosuf, kept apart from the social profiles: one is a
  // booking link and one is a real address, and neither is a "profile".
  contact: [
    { label: 'Schedule a call', href: 'https://cal.com/yoosuf', rel: 'noopener noreferrer', opensNewTab: true },
    { label: 'Email', href: `mailto:${SITE.email}`, rel: 'me' },
  ],
  social: [
    { label: 'X', href: 'https://twitter.com/aitchdei', rel: 'me noopener noreferrer', opensNewTab: true, context: 'profile' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yoosufm', rel: 'me noopener noreferrer', opensNewTab: true, context: 'profile' },
    { label: 'GitHub', href: 'https://github.com/yoosuf', rel: 'me noopener noreferrer', opensNewTab: true, context: 'profile' },
    { label: 'Medium', href: 'https://yoosuf.medium.com', rel: 'me noopener noreferrer', opensNewTab: true, context: 'profile' },
  ],
  utility: [
    { label: 'RSS', href: '/feed.xml' },
    { label: 'Terms', href: '/terms/' },
    { label: 'Privacy', href: '/privacy/' },
  ],
} as const

/** Profiles that resolve to the same person. Single source for `Person.sameAs`
 *  in schema and for the `rel="me"` links in the document head — a profile that
 *  is claimed in one place and forgotten in the other is a broken identity. */
export const SOCIAL_PROFILES = [
  'https://twitter.com/aitchdei',
  'https://www.linkedin.com/in/yoosufm',
  'https://github.com/yoosuf',
  'https://yoosuf.medium.com',
  'https://www.facebook.com/aitchdei',
  'https://www.instagram.com/aitchdei',
  'https://www.youtube.com/@YoosufMo',
] as const

export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE.url}/#person`,
  name: 'Yoosuf Mohamed',
  alternateName: ['Yoosuf Mo', 'Yoosuf', 'aitchdei'],
  url: SITE.url,
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/#about` },
  image: `${SITE.url}/assets/images/yoosuf.jpg`,
  jobTitle: ['Systems Architect', 'AI Engineer', 'Software Architect', 'Technical Consultant'],
  description:
    'Yoosuf Mohamed, also known as Yoosuf Mo and aitchdei, is a systems architect, AI engineer, software architect, and technical consultant helping startups and enterprises build AI automation, LLM/RAG systems, SaaS platforms, and AI-first products.',
  knowsAbout: [
    'Yoosuf Mohamed', 'Yoosuf Mo', 'AI Automation', 'AI Agents', 'LLM', 'RAG',
    'Retrieval-Augmented Generation', 'Software Architecture', 'Systems Architecture',
    'SaaS Architecture', 'Technical Leadership', 'Go', 'Elixir', 'FastAPI', 'Node.js',
    'NestJS', 'Next.js', 'React', 'Flutter', 'AWS', 'Elasticsearch', 'Redis', 'GraphQL',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Systems Architect',
    occupationalCategory: 'Software architecture and AI engineering',
    skills:
      'AI automation, LLM applications, RAG systems, SaaS architecture, backend engineering, full-stack product development, technical leadership',
  },
  worksFor: { '@id': `${SITE.url}/#organization` },
  homeLocation: { '@type': 'Place', name: 'Colombo, Sri Lanka' },
  subjectOf: [
    { '@type': 'WebPage', name: 'About Yoosuf Mohamed', url: `${SITE.url}/about/` },
    { '@type': 'WebPage', name: 'Services by Yoosuf Mohamed', url: `${SITE.url}/services/` },
    { '@type': 'SoftwareApplication', name: 'Postwire', url: `${SITE.url}/postwire/` },
  ],
  sameAs: [...SOCIAL_PROFILES],
}

/** The studio the site is published under, kept separate from the person who
 *  writes on it. Naming the Organization after the person and listing the studio
 *  as its `alternateName` — while `Person.worksFor` also claims the studio — puts
 *  "Crew Digital" in the knowledge graph as an alias of a human being, so the
 *  two are resolved as distinct entities here and cross-linked by `@id`. */
export const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: 'Crew Digital',
  description: 'Product studio where Yoosuf Mohamed works as a Systems Architect, and the publisher of yoosuf.me.',
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE.url}/#organization-logo`,
    url: new URL(SITE.logoMark, SITE.url).href,
    width: 512,
    height: 512,
  },
  founder: { '@id': `${SITE.url}/#person` },
  member: { '@id': `${SITE.url}/#person` },
}

/** Site-wide WebSite node with publisher reference. Emitted on every page. */
export const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.title,
  description: SITE.description,
  url: SITE.url,
  inLanguage: SITE.lang,
  publisher: { '@id': `${SITE.url}/#organization` },
  author: { '@id': `${SITE.url}/#person` },
}

/** Identifier strings used to cross-link entities in JSON-LD. */
export const SCHEMA_IDS = {
  website: `${SITE.url}/#website`,
  organization: `${SITE.url}/#organization`,
  person: `${SITE.url}/#person`,
} as const
