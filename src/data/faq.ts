export interface FaqItem {
  question: string
  answer: string
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&mdash;': '—',
  '&ndash;': '–',
  '&nbsp;': ' ',
  '&middot;': '·',
  '&hellip;': '…',
  '&lsquo;': '‘',
  '&rsquo;': '’',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
}

/**
 * FAQ markup is authored in the product bodies (one generated from
 * `src/data/postwire.html`, one hand-written in `MessengerBody.astro`) and is
 * the only copy the visitor sees. Structured data is derived from that same
 * markup at build time so a question can never drift out of sync with the
 * answer the page actually renders.
 */
export function extractFaqItems(markup: string, source: string): FaqItem[] {
  const items: FaqItem[] = []

  for (const [, block] of markup.matchAll(
    /<details\b[^>]*\bdata-faq-item\b[^>]*>([\s\S]*?)<\/details>/g,
  )) {
    const question = block.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/)
    const answer = block.match(/<div\b[^>]*\bdata-faq-body\b[^>]*>([\s\S]*?)<\/div>/)

    if (!question || !answer) {
      throw new Error(`[faq] A disclosure in ${source} has no summary or body.`)
    }

    items.push({ question: toText(question[1]), answer: toText(answer[1]) })
  }

  if (items.length === 0) {
    throw new Error(`[faq] No FAQ disclosures found in ${source}.`)
  }

  const broken = items.find((item) => !item.question || item.answer.length < 20)
  if (broken) {
    throw new Error(`[faq] Incomplete FAQ entry in ${source}: ${JSON.stringify(broken)}`)
  }

  return items
}

function toText(fragment: string): string {
  return fragment
    .replace(/<svg\b[\s\S]*?<\/svg>/g, ' ')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity)
    .replace(/\s+/g, ' ')
    // An inline <code> becomes a word, so tighten the punctuation that follows it.
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim()
}
