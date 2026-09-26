/**
 * Build-time syntax highlighting for the product microsites.
 *
 * Prism runs during SSR and the resulting markup is injected with `set:html`,
 * so no highlighter ever reaches the browser. The HTML is assembled from inline
 * `<span>`s joined by literal newlines rather than block elements: inside
 * `white-space: pre-wrap` that renders one row per line *and* keeps the
 * newlines intact when a visitor selects and copies the snippet, which
 * `display: block` rows would swallow.
 *
 * Highlighting is per-line because the microsites mix languages inside a
 * single block — a `curl` command followed by its JSON response, or a shell
 * session interleaved with SQL. Highlighting a whole block as one language
 * paints the other half with the wrong grammar.
 */
import Prism from 'prismjs'
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-json.js'
import 'prismjs/components/prism-sql.js'

export type CodeLang = 'bash' | 'javascript' | 'json' | 'sql'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Tokenise one line, falling back to escaped plain text for unknown langs. */
export function highlightLine(code: string, lang?: CodeLang): string {
  if (lang) {
    const grammar = Prism.languages[lang]
    if (grammar) return Prism.highlight(code, grammar, lang)
  }
  return escapeHtml(code)
}

/** A line that opens a JSON document, e.g. `{` or `{ "codes": [] }`. */
const opensJson = (line: string) => /^\s*[[{]/.test(line)

/**
 * Tokenise a whole snippet, resolving the language per line.
 *
 * `lang` is the block's base language and is always authored explicitly — it is
 * never guessed. The one automatic step is a forward switch to `json`: a shell
 * snippet that pipes into a JSON response (`curl .../extract` followed by its
 * payload) is a single `<pre>` in the authored markup, and every such block in
 * the microsites puts the JSON last. So a line that opens a JSON document ends
 * the shell region and hands the remainder of the block to the JSON grammar.
 */
export function highlightBlock(code: string, lang?: CodeLang): string {
  const lines = code.split('\n')
  let current = lang
  return lines
    .map((line) => {
      if (current === 'bash' && opensJson(line)) current = 'json'
      return highlightLine(line, current)
    })
    .join('\n')
}
