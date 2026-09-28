const NAMED_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
  '&middot;': '·',
  '&lsquo;': '‘',
  '&rsquo;': '’',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  // Last on purpose: `&amp;mdash;` is an escaped ampersand followed by the
  // literal text "mdash;", and decoding it early would invent an em dash.
  '&amp;': '&',
}

/** Decode common HTML numeric and named entities in a string. */
export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-z][a-z0-9]*);/gi, (entity) => NAMED_ENTITIES[entity.toLowerCase()] ?? entity)
}

/** Ensure a path has a trailing slash. */
export function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`
}

/** Format a Date as "5 Jun, 2023" (legacy %-d %b, %Y style). */
export function formatShortDate(d: Date): string {
  const day = d.getDate()
  const month = d.toLocaleString('en-US', { month: 'short' })
  const year = d.getFullYear()
  return `${day} ${month}, ${year}`
}

/** ISO 8601 date string for datetime attributes. */
export function toISODate(d: Date): string {
  return d.toISOString()
}

/** Approximate reading time in minutes (words / 200, min 1). */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.floor(words / 200))
}