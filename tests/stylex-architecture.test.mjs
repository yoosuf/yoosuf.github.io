import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { assertBuildOutput } from '../scripts/build-without-warnings.mjs'
import { inspectSource } from '../scripts/check-stylex-architecture.mjs'

async function fixture(files) {
  const rootDir = await mkdtemp(join(tmpdir(), 'stylex-architecture-'))
  await Promise.all(Object.entries(files).map(async ([file, contents]) => {
    const path = join(rootDir, file)
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, contents)
  }))
  return rootDir
}

test('rejects StyleX modules inside Astro routes', async () => {
  const rootDir = await fixture({ 'src/pages/notFound.stylex.ts': 'export const x = 1' })

  assert.deepEqual(inspectSource({ rootDir }).map(({ code }) => code), ['STYLEX_ROUTE_FILE'])
})

test('rejects narrowed StyleX attributes', async () => {
  const rootDir = await fixture({
    'src/pages/index.astro': 'class={stylex.attrs(styles.root).class}',
  })

  assert.deepEqual(inspectSource({ rootDir }).map(({ code }) => code), ['NARROWED_STYLEX_ATTRS'])
})

test('rejects narrowed StyleX React props and legacy utility strings', async () => {
  const rootDir = await fixture({
    'src/components/Menu.tsx': 'className={stylex.props(styles.root).className}\n<div className="flex gap-3" />',
  })

  assert.deepEqual(
    inspectSource({ rootDir }).map(({ code }) => code),
    ['NARROWED_STYLEX_PROPS', 'LEGACY_UTILITY_CLASS'],
  )
})

test('allows documented global hooks that contain utility-like words', async () => {
  const rootDir = await fixture({
    'src/layouts/ProductLayout.astro': '<div class="pm-hero-grid">Product content</div>',
  })

  assert.deepEqual(inspectSource({ rootDir }), [])
})

test('rejects build output warnings and accidental StyleX route output', () => {
  assert.throws(
    () => assertBuildOutput({ stderr: '[WARN] [router] unexpected route', stdout: '', routeFiles: [] }),
    /Build emitted a warning/,
  )
  assert.throws(
    () => assertBuildOutput({ stderr: '', stdout: '', routeFiles: ['notFound.stylex'] }),
    /dist\/notFound\.stylex/,
  )
})
