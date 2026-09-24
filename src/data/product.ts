export interface ProductAction {
  label: string
  href: string
  variant?: 'primary' | 'ghost'
  icon?: 'launch' | 'arrow'
  external?: boolean
}

export interface ProductNavLink {
  label: string
  href: string
}

export interface ProductAccent {
  accent?: string
  accentStrong?: string
  accentDeep?: string
  accentSoft?: string
  onAccent?: string
}

export interface ProductSeo {
  title: string
  description: string
  image?: string
  imageAlt?: string
  keywords: string
  canonical: string
}

export interface ProductHero {
  tag: string
  title: string
  sub: string
  actions: ProductAction[]
  checks: string[]
}

export interface ProductCta {
  title: string
  text: string
  actions: ProductAction[]
}

export interface Product {
  slug: string
  name: string
  homeHref: string
  tagline?: string
  accent?: ProductAccent
  navLinks: ProductNavLink[]
  hero: ProductHero
  cta: ProductCta
  seo: ProductSeo
}

export const pinemail: Product = {
  slug: 'pinemail',
  name: 'Pine Mail',
  homeHref: '/pinemail/',
  accent: {
    accent: '#2563eb',
    accentStrong: '#1d4ed8',
    accentDeep: '#1e40af',
    accentSoft: '#e9effd',
    onAccent: '#ffffff',
  },
  navLinks: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#howitworks' },
    { label: 'Docs', href: '#docs' },
    { label: 'Install', href: '#install' },
    { label: 'AI agents', href: '#mcp' },
    { label: 'FAQ', href: '#faq' },
  ],
  hero: {
    tag: 'Open Source · MIT License · Rust',
    title: 'Local auth testing without the flaky inbox dance',
    sub: 'Pine Mail catches email OTPs, magic links, password resets, and SMS 2FA codes for local development, Playwright tests, CI pipelines, and AI agents. One tiny Rust binary — long-polling waits, Twilio webhooks, and structured signal extraction.',
    actions: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/yoosuf/pinemail',
        variant: 'primary',
        icon: 'arrow',
        external: true,
      },
      {
        label: 'Docker Hub',
        href: 'https://hub.docker.com/r/yoosuf/pinemail',
        variant: 'ghost',
        external: true,
      },
    ],
    checks: [
      'SMTP mail catcher + SMS catcher',
      'OTP and magic-link extraction',
      '14 native MCP tools for agents',
    ],
  },
  cta: {
    title: 'Make auth testing boring again.',
    text: 'Pine Mail catches email OTPs, magic links, password resets, and SMS 2FA codes — free, open source under the MIT license, running locally in under 30 seconds.',
    actions: [
      {
        label: 'Upvote on Product Hunt',
        href: 'https://www.producthunt.com/products/pinemail?launch=pinemail',
        variant: 'primary',
        icon: 'launch',
        external: true,
      },
      {
        label: 'View on GitHub',
        href: 'https://github.com/yoosuf/pinemail',
        variant: 'ghost',
        icon: 'arrow',
        external: true,
      },
      {
        label: 'Docker Hub',
        href: 'https://hub.docker.com/r/yoosuf/pinemail',
        variant: 'ghost',
        external: true,
      },
      {
        label: 'Read the full story',
        href: '/blog/pinemail-sms-mcp-analysis',
        variant: 'ghost',
      },
    ],
  },
  seo: {
    title:
      'Pine Mail — Local Auth Testing for Email OTP, Magic Links, SMS 2FA, and AI Agents',
    description:
      'Pine Mail is a free, open-source local auth testing tool: SMTP mail catcher, SMS catcher, Twilio webhook receiver, OTP and magic-link extractor, long-polling API, and native MCP server for AI agents. A single Rust binary for Playwright, CI, and developer workflows.',
    image: '/assets/images/pinemail-og.png',
    imageAlt:
      'Pine Mail — local auth testing for email OTPs, magic links, SMS 2FA, Playwright tests, CI, and AI agents. Open source, MIT license, written in Rust.',
    keywords:
      'local auth testing, SMTP mail catcher, SMS catcher, Twilio webhook receiver, email testing tool, OTP testing, magic link testing, SMS 2FA testing, Playwright auth testing, CI email testing, Mailpit alternative, MailHog alternative, Mailtrap alternative, AI agent email testing, MCP email tools, MCP server, Rust, open source, E2E testing, email verification code',
    canonical: '/pinemail/',
  },
}

export const messenger: Product = {
  slug: 'messenger',
  name: 'Messenger',
  homeHref: '/messenger/',
  accent: {
    accent: '#2563eb',
    accentStrong: '#1d4ed8',
    accentDeep: '#1e40af',
    accentSoft: '#e9effd',
    onAccent: '#ffffff',
  },
  navLinks: [
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Use cases', href: '#usecases' },
    { label: 'Schema', href: '#schema' },
    { label: 'Guides', href: '#guides' },
    { label: 'Quick start', href: '#quickstart' },
  ],
  hero: {
    tag: 'Open Source · Chat Schema · PostgreSQL / MySQL',
    title: 'The database core for realtime conversations',
    sub: 'Ship chat products faster with a practical relational schema for one-to-one chat, group messaging, moderation, device sessions, and attachment workflows. Ready for Node.js or Go backends with PostgreSQL and socket support.',
    actions: [
      {
        label: 'View Repository',
        href: 'https://github.com/yoosuf/Messenger',
        variant: 'primary',
        icon: 'arrow',
        external: true,
      },
      {
        label: 'Explore SQL Schema',
        href: 'https://github.com/yoosuf/Messenger/blob/master/messenger.sql',
        variant: 'ghost',
        icon: 'arrow',
        external: true,
      },
    ],
    checks: [
      'One-to-one + group messaging',
      'Report & block built in',
      '16 relational tables',
    ],
  },
  cta: {
    title: 'Ship your chat backend on a proven schema.',
    text: 'Messenger is an open-source relational design for modern messaging: one-to-one and group chat, media, moderation, and multi-device access. Import the SQL, wire your API layer, and go.',
    actions: [
      {
        label: 'Star on GitHub',
        href: 'https://github.com/yoosuf/Messenger',
        variant: 'primary',
        icon: 'launch',
        external: true,
      },
      {
        label: 'Read Documentation',
        href: 'https://github.com/yoosuf/Messenger/blob/master/README.md',
        variant: 'ghost',
        external: true,
      },
      {
        label: 'Node.js + Socket.IO guide',
        href: 'https://github.com/yoosuf/Messenger/blob/master/docs/NODE_EXPRESS_TYPESCRIPT_POSTGRES_SOCKET.md',
        variant: 'ghost',
        external: true,
      },
      {
        label: 'Go + WebSocket guide',
        href: 'https://github.com/yoosuf/Messenger/blob/master/docs/GO_POSTGRES_SOCKET.md',
        variant: 'ghost',
        external: true,
      },
    ],
  },
  seo: {
    title: 'Messenger — Open Source Chat Database Schema for Realtime Messaging',
    description:
      'Messenger is an open source relational chat schema: users, conversations, participants, messages, attachments, moderation (reports & blocks), device sessions, and per-user visibility. A database foundation for Node.js or Go chat backends on PostgreSQL or MySQL.',
    keywords:
      'chat database schema, messaging database design, group chat schema, one-to-one chat schema, PostgreSQL chat schema, MySQL chat schema, chat backend, realtime messaging, conversations table, participants table, message persistence, attachments table, moderation, block list, reports, devices, access tokens, Node.js chat, Go chat backend, Socket.IO, WebSocket, open source database design, Yoosuf Mohamed',
    canonical: '/messenger/',
  },
}