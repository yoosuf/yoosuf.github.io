import { readFile, writeFile } from 'node:fs/promises'

const files = [
  new URL('../src/layouts/ProductLayout.astro', import.meta.url),
  new URL('../src/pages/pinemail.astro', import.meta.url),
]

for (const path of files) {
  let source = await readFile(path, 'utf8')
  source = source.replace(/\nconst attrsOf = stylex\.attrs\nconst pmCls = \(\.\.\.keys\) => attrsOf\(\.\.\.keys\)\.class\n/, '\n')
  source = source.replace(/class:list=\{\[([^\]]+)\]\}/g, (_match, contents) => {
    const parts = contents.split(',').map((part) => part.trim()).filter(Boolean)
    const staticClasses = parts.filter((part) => /^['"`]/.test(part)).map((part) => part.slice(1, -1)).join(' ')
    const styleKeys = parts
      .filter((part) => part.startsWith('pmCls('))
      .flatMap((part) => [...part.matchAll(/styles\.([A-Za-z0-9_$]+)/g)].map(([, key]) => `styles.${key}`))
    if (styleKeys.length === 0) return staticClasses ? `class="${staticClasses}"` : ''
    return `${staticClasses ? `class="${staticClasses}" ` : ''}{...stylex.attrs(${styleKeys.join(', ')})}`
  })
  await writeFile(path, source)
}
