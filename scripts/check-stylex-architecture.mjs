import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'

const SOURCE_FILE = /\.(?:astro|[cm]?[jt]sx?)$/
const ROUTE_STYLEX_FILE = /^src\/pages\/.*\.stylex\.[cm]?[jt]sx?$/
const NARROWED_ATTRS = /stylex\.attrs\((?:[^()]|\([^()]*\))*\)\.class\b/g
const NARROWED_PROPS = /stylex\.props\((?:[^()]|\([^()]*\))*\)\.className\b/g
const CLASS_ATTRIBUTE = /class(?:Name)?=["']([^"']*)["']/g
const LEGACY_UTILITY_TOKEN = /(?:^|\s)(?:flex|grid|gap-\d+|m-0|p-\d+|text-[\w-]+|bg-[\w-]+)(?=\s|$)/

function sourceFiles(rootDir, directory = 'src') {
  const absoluteDirectory = join(rootDir, directory)
  const entries = readdirSync(absoluteDirectory, { withFileTypes: true })
  const files = entries.map((entry) => {
    const child = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(rootDir, child)
    return SOURCE_FILE.test(entry.name) ? [child] : []
  })

  return files.flat()
}

function lineFor(source, offset) {
  return source.slice(0, offset).split('\n').length
}

function diagnostic(code, file, source, offset, message) {
  return { code, file, line: lineFor(source, offset), message, offset }
}

function matchingDiagnostics({ file, source }) {
  const diagnostics = []
  if (ROUTE_STYLEX_FILE.test(file)) {
    diagnostics.push(diagnostic('STYLEX_ROUTE_FILE', file, source, 0, 'StyleX modules must not live under src/pages.'))
  }

  for (const [code, expression, message] of [
    ['NARROWED_STYLEX_ATTRS', NARROWED_ATTRS, 'Spread stylex.attrs(...) instead of reading only .class.'],
    ['NARROWED_STYLEX_PROPS', NARROWED_PROPS, 'Spread stylex.props(...) instead of reading only .className.'],
  ]) {
    for (const match of source.matchAll(expression)) {
      diagnostics.push(diagnostic(code, file, source, match.index, message))
    }
  }

  for (const match of source.matchAll(CLASS_ATTRIBUTE)) {
    if (LEGACY_UTILITY_TOKEN.test(match[1])) {
      diagnostics.push(diagnostic('LEGACY_UTILITY_CLASS', file, source, match.index, 'Use a StyleX style instead of a legacy utility class string.'))
    }
  }

  return diagnostics
}

export function inspectSource({ rootDir }) {
  const files = sourceFiles(rootDir)
  const diagnostics = files.map((file) => {
    const source = readFileSync(join(rootDir, file), 'utf8')
    return matchingDiagnostics({ file, source })
  }).flat()

  return diagnostics
    .sort((left, right) => left.file.localeCompare(right.file) || left.offset - right.offset)
    .map(({ offset, ...diagnostic }) => diagnostic)
}

export function assertCleanSource(options) {
  const diagnostics = inspectSource(options)
  if (diagnostics.length > 0) {
    throw new Error(diagnostics.map(({ code, file, line, message }) => `${code} ${file}:${line} ${message}`).join('\n'))
  }
}

const invokedAsScript = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (invokedAsScript) {
  assertCleanSource({ rootDir: process.cwd() })
}
