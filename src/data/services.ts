export interface Service {
  name: string
  tab: string
  description: string
  includes: string[]
  duration: string
  cta: string
}

export const SERVICES: Service[] = [
  {
    name: 'Architecture & Technical Consulting',
    tab: 'Consulting',
    description:
      'A focused working session on your hardest technical decisions. We dig into your architecture, weigh the trade-offs, and you walk away with a clear, prioritised plan you can actually execute.',
    includes: [
      'Architecture review',
      'Technical recommendations',
      'System design',
      'Technology evaluation',
      'Technical roadmap',
    ],
    duration: '1–5 days',
    cta: 'Discuss Architecture',
  },
  {
    name: 'Architecture & Performance Audit',
    tab: 'Performance Audit',
    description:
      'A full teardown of your application by someone who has seen a lot of production systems. You get a prioritised list of what\'s actually worth fixing — performance, architecture, security, infrastructure — and a roadmap to get there.',
    includes: [
      'Application architecture review',
      'Backend/API assessment',
      'Database analysis',
      'Frontend performance review',
      'Infrastructure review',
      'Scalability assessment',
      'Prioritised remediation roadmap',
    ],
    duration: '1–2 weeks',
    cta: 'Request an Audit',
  },
  {
    name: 'AI Integration',
    tab: 'AI Integration',
    description:
      'Add LLM-powered features to a product you already ship, without bolting on complexity. Practical AI — assistants, RAG, document intelligence, and workflow automation that fit your existing stack.',
    includes: [
      'LLM integration',
      'AI assistants',
      'RAG',
      'Document intelligence',
      'AI-powered search',
      'Workflow automation',
      'AI architecture',
    ],
    duration: '2–6 weeks',
    cta: 'Discuss an AI Project',
  },
  {
    name: 'Product Development',
    tab: 'Product Development',
    description:
      'From architecture to production deployment, I build, modernise, or extend your software end to end. Senior, hands-on delivery — not a handoff to a junior team.',
    includes: [
      'Technical discovery',
      'Architecture',
      'Backend development',
      'Frontend development',
      'API development',
      'Cloud infrastructure',
      'CI/CD',
      'Production deployment',
    ],
    duration: '4–12+ weeks',
    cta: 'Start a Project',
  },
  {
    name: 'Fractional Tech Lead',
    tab: 'Fractional Tech Lead',
    description:
      'Senior technical direction for teams that have outgrown guesswork. Architecture decisions, engineering standards, code reviews, and mentoring — real leadership without the full-time cost.',
    includes: [
      'Architecture decisions',
      'Technical roadmap',
      'Engineering standards',
      'Code/PR reviews',
      'Technical mentoring',
      'Infrastructure decisions',
      'Engineering process improvement',
    ],
    duration: 'Monthly',
    cta: 'Discuss Fractional Leadership',
  },
]

/** SVG icon name → icon component will map in Phase 4. */
export const SERVICE_ICONS: Record<string, string> = {
  Consulting: 'lamp',
  'Performance Audit': 'gauge',
  'AI Integration': 'grid',
  'Product Development': 'code',
  'Fractional Tech Lead': 'users',
}

export interface Faq {
  q: string
  a: string
}

/** Engagement questions rendered as the native-`<details>` FAQ and published as
 *  FAQPage structured data, so both views always come from the same copy. */
export const SERVICES_FAQS: Faq[] = [
  {
    q: 'Do you work with startups or only enterprises?',
    a: 'Both. Most of my work is with startups scaling past an MVP, but I regularly take on enterprise engagements for AI, modernization, and performance work.',
  },
  {
    q: 'How are engagements priced?',
    a: 'Every engagement is scoped and quoted individually based on complexity, timeline, and requirements. You always get a written proposal with a fixed price before any work begins.',
  },
  {
    q: 'Do you work alongside my existing team?',
    a: "Usually, yes — that's the point. I can lead, review, mentor, or just be the senior engineer your team is missing, working inside your existing stack and workflow.",
  },
  {
    q: 'What happens when the engagement ends?',
    a: 'You own everything we build. Delivery includes documentation and a proper handover, and most clients keep me on a lighter retainer or move to a fractional arrangement.',
  },
]