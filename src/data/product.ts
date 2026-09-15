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
  image: string
  imageAlt: string
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
    accent: '#10b981',
    accentStrong: '#059669',
    accentDeep: '#047857',
    accentSoft: '#d1fae5',
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