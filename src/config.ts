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

export const FOOTER_LINKS = [
  { label: 'Schedule a Call', href: 'https://cal.com/yoosuf', icon: 'calendar' },
  { label: 'Email', href: 'mailto:mayoosuf@gmail.com', icon: 'mail' },
  { label: 'X', href: 'https://twitter.com/aitchdei', icon: 'x' },
  { label: 'GitHub', href: 'https://github.com/yoosuf', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yoosufm', icon: 'linkedin' },
  { label: 'Yoosuf', href: '/yoosuf/', icon: null },
  { label: 'Medium', href: 'https://yoosuf.medium.com', icon: 'medium' },
] as const

export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE.url}/#person`,
  name: 'Yoosuf Mohamed',
  alternateName: ['Yoosuf Mo', 'Yoosuf', 'aitchdei'],
  url: SITE.url,
  mainEntityOfPage: SITE.url,
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
  worksFor: { '@type': 'Organization', name: 'Crew Digital' },
  homeLocation: { '@type': 'Place', name: 'Colombo, Sri Lanka' },
  subjectOf: [
    { '@type': 'WebPage', name: 'About Yoosuf Mohamed', url: `${SITE.url}/about/` },
    { '@type': 'WebPage', name: 'Services by Yoosuf Mohamed', url: `${SITE.url}/services/` },
    { '@type': 'SoftwareApplication', name: 'Pine Mail', url: `${SITE.url}/pinemail/` },
  ],
  sameAs: [
    'https://twitter.com/aitchdei',
    'https://www.facebook.com/aitchdei',
    'https://www.instagram.com/aitchdei',
    'https://www.youtube.com/@YoosufMo',
    'https://www.linkedin.com/in/yoosufm',
    'https://github.com/yoosuf',
    'https://yoosuf.medium.com',
  ],
}

/** Site-wide Organization node — the shared publisher reference for every
 *  page-level schema block. Children resolve it by @id (`/#organization`). */
export const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.title,
  alternateName: 'Crew Digital',
  url: SITE.url,
  email: SITE.email,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE.url}/#organization-logo`,
    url: new URL(SITE.logoMark, SITE.url).href,
    width: 512,
    height: 512,
  },
  founder: { '@type': 'Person', name: SITE.author, url: `${SITE.url}/about/` },
  sameAs: [
    'https://twitter.com/aitchdei',
    'https://www.linkedin.com/in/yoosufm',
    'https://github.com/yoosuf',
    'https://yoosuf.medium.com',
  ],
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
