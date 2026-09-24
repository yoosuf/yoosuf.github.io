import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/components/product/PinemailBody.astro', import.meta.url)
let source = await readFile(path, 'utf8')

// The source document is HTML-shaped, but Astro expression strings do not
// decode HTML entities. Normalize them before emission so visible text never
// leaks entities such as `&mdash;` or `&lt;15 MB` into the page.
source = source
  .replaceAll('&amp;', '&')
  .replaceAll('&mdash;', '—')
  .replaceAll('&middot;', '·')
  .replaceAll('&nbsp;', ' ')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&rarr;', '→')
  .replaceAll('&larr;', '←')

source = source.replace(/\nconst attrsOf = stylex\.attrs\nconst pmCls = \(\.\.\.keys\) => attrsOf\(\.\.\.keys\)\.class\n/, '\n')
source = source.replace(/class:list=\{\[([^\]]+)\]\}/g, (_match, contents) => {
  const parts = contents.split(',').map((part) => part.trim()).filter(Boolean)
  const staticClasses = parts
    .filter((part) => /^['"`]/.test(part))
    .map((part) => part.slice(1, -1))
    .join(' ')
  const styleKeys = parts
    .filter((part) => part.startsWith('pmCls('))
    .flatMap((part) => [...part.matchAll(/styles\.([A-Za-z0-9_$]+)/g)].map(([, key]) => `styles.${key}`))

  if (styleKeys.length === 0) return staticClasses ? `data-pm-hook="${staticClasses}"` : ''
  const classAttr = staticClasses ? `data-pm-hook="${staticClasses}" ` : ''
  return `${classAttr}{...stylex.attrs(${styleKeys.join(', ')})}`
})

// Compose adjacent StyleX spreads so Astro emits one class attribute. This
// matters for cells that already have a semantic variant style (for example
// comparison symbols) and then receive the shared table-cell style.
source = source.replace(
  /\{\.\.\.stylex\.attrs\(([^)]+)\)\}([^>]*)\{\.\.\.stylex\.attrs\(([^)]+)\)\}/g,
  (_match, first, between, second) => `{...stylex.attrs(${first}, ${second})}${between}`,
)

// The Pinemail page is generated from a large authored document. Keep the
// semantic hooks for inspection, but attach all presentation to StyleX at the
// point where the corresponding element is emitted. These transforms are
// guarded so the generator remains safe to run repeatedly.
if (!source.includes('styles.pmFaqSummary')) {
  source = source.replace(
    /<li class="pm-flow-log-line pm-log-hit">/g,
    '<li class="pm-flow-log-line pm-log-hit" {...stylex.attrs(styles.pmFlowLogLine, styles.pmFlowLogHit)}>',
  )
  source = source.replace(
    /<li class="pm-flow-log-line">/g,
    '<li class="pm-flow-log-line" {...stylex.attrs(styles.pmFlowLogLine)}>',
  )
  source = source.replace(
    /(<li class="pm-flow-log-line[^>]*>[\s\S]*?)<time>/g,
    '$1<time {...stylex.attrs(styles.pmFlowLogTime)}>',
  )

  source = source.replace(
    /(<li class="pm-workflow-step"[^>]*>[\s\S]*?)<p>/g,
    '$1<p {...stylex.attrs(styles.pmWorkflowStepText)}>',
  )

  source = source.replace(/<summary>/g, '<summary {...stylex.attrs(styles.pmFaqSummary)}>')
  source = source.replace(
    /(<details class="pm-faq-item"[\s\S]*?<summary[\s\S]*?<\/summary>\s*)<p>/g,
    '$1<p {...stylex.attrs(styles.pmFaqAnswer)}>',
  )

  source = source.replace(/<code>/g, '<code {...stylex.attrs(styles.pmInlineCode)}>')

  source = source.replace(/<th(?=\s|>)([^>]*)>/g, (_match, attrs) =>
    `<th${attrs} {...stylex.attrs(styles.pmTableCell, styles.pmTableHeader)}>`,
  )
  source = source.replace(/<td(?=\s|>)([^>]*)>/g, (_match, attrs) =>
    `<td${attrs} {...stylex.attrs(styles.pmTableCell)}>`,
  )
}

await writeFile(path, source)
