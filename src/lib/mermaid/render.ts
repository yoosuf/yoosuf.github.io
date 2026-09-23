import {
  configForVariant,
  prefersDark,
  type MermaidScheme,
  type MermaidVariant,
} from './config'

type MermaidApi = (typeof import('mermaid'))['default']
type MermaidTarget = HTMLElement & { dataset: DOMStringMap }

let mermaidPromise: Promise<MermaidApi> | null = null
let initializedScheme: 'light' | 'dark' | null = null
let bootstrapRegistered = false
let renderGeneration = 0
let schemeListenerRegistered = false

function targets(): MermaidTarget[] {
  return [...document.querySelectorAll<MermaidTarget>('[data-mermaid-target]')]
}

function variantFor(target: MermaidTarget): MermaidVariant {
  return target.closest<HTMLElement>('[data-mermaid-variant]')?.dataset.mermaidVariant === 'marker'
    ? 'marker'
    : 'pencil'
}

async function loadMermaid(): Promise<MermaidApi> {
  if (mermaidPromise) return mermaidPromise
  mermaidPromise = import('mermaid')
    .then(({ default: mermaid }) => mermaid)
    .catch((error) => {
      // One-shot: don't cache the rejection. The module is large and is split
      // into many chunks, so a single dropped/failed fetch (slow networks,
      // cold caches, flaky static hosts) must not poison every diagram on the
      // page. Clear and retry so a second attempt can succeed.
      mermaidPromise = null
      throw error
    })
  return mermaidPromise
}

async function loadMermaidWithRetries(retries = 2, delayMs = 600): Promise<MermaidApi> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await loadMermaid()
    } catch (error) {
      lastError = error
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)))
    }
  }
  throw lastError
}

function setState(target: MermaidTarget, state: 'pending' | 'ready' | 'error'): void {
  const classes = {
    pending: target.dataset.mermaidPendingClass,
    ready: target.dataset.mermaidReadyClass,
    error: target.dataset.mermaidErrorClass,
  }

  Object.entries(classes).forEach(([name, className]) => {
    if (className && name !== state) target.classList.remove(...className.split(' '))
  })
  const activeClass = classes[state]
  if (activeClass) target.classList.add(...activeClass.split(' '))
  target.dataset.mermaidState = state
}

function sourceFor(target: MermaidTarget): string {
  const source = target.querySelector<HTMLElement>('[data-mermaid-source]')
  const sourceText = source instanceof HTMLTemplateElement ? source.content.textContent : source?.textContent
  return sourceText ?? target.dataset.mermaidSource ?? target.textContent ?? ''
}

export function normalizeDiagramSource(source: string): string {
  const verticalFlow = source.replace(
    /(^|\n)(\s*)(flowchart|graph)\s+(LR|RL)(?=\s|$)/gi,
    (_match, lineStart: string, indentation: string, diagramType: string) =>
      `${lineStart}${indentation}${diagramType} TB`,
  )

  return verticalFlow.replace(
    /(^|\n)(\s*)direction\s+(LR|RL)(?=\s|$)/gi,
    (_match, lineStart: string, indentation: string) => `${lineStart}${indentation}direction TB`,
  )
}

function targetId(target: MermaidTarget, usedIds: Set<string>, index: number): string {
  const base = target.dataset.mermaidId || `mermaid-${index + 1}`
  let id = base
  let suffix = 2
  while (usedIds.has(id) || document.getElementById(id)) {
    id = `${base}-${suffix}`
    suffix += 1
  }
  usedIds.add(id)
  return id
}

function prepareLegacyBlocks(): void {
  document.querySelectorAll<HTMLPreElement>('pre[data-language="mermaid"]').forEach((pre) => {
    if (pre.dataset.mermaidPrepared === 'true') return
    pre.dataset.mermaidPrepared = 'true'
    pre.dataset.mermaidTarget = ''
    pre.dataset.mermaidState = 'pending'
    pre.dataset.mermaidSource = pre.textContent ?? ''
  })
}

async function renderTarget(
  mermaid: MermaidApi,
  target: MermaidTarget,
  id: string,
  generation: number,
): Promise<void> {
  const scheme = prefersDark() ? 'dark' : 'light'
  // Re-render when the active color scheme no longer matches the last render,
  // even if the target already shows a diagram (mermaid bakes colors into the
  // SVG and can't re-resolve a CSS `light-dark()`).
  if (
    generation !== renderGeneration ||
    (target.dataset.mermaidState === 'ready' && target.dataset.mermaidScheme === scheme) ||
    target.dataset.mermaidRendering === 'true'
  ) return

  const source = sourceFor(target)
  if (!source.trim()) return
  target.dataset.mermaidRendering = 'true'
  const renderSource = normalizeDiagramSource(source)
  setState(target, 'pending')

  try {
    const { svg, bindFunctions } = await mermaid.render(id, renderSource, target)
    if (generation !== renderGeneration || !target.isConnected) return
    target.innerHTML = svg
    bindFunctions?.(target)
    target.dataset.mermaidScheme = scheme
    setState(target, 'ready')
  } catch (error) {
    if (generation !== renderGeneration || !target.isConnected) return
    console.error(`Mermaid diagram ${id} failed to render:`, error)
    // Keep parser failures out of the page. The diagram is optional content;
    // diagnostics stay in the console without exposing implementation text to
    // readers or leaving raw Mermaid source visible.
    target.replaceChildren()
    target.setAttribute('aria-hidden', 'true')
    setState(target, 'error')
  } finally {
    delete target.dataset.mermaidRendering
  }
}

export async function renderMermaidDiagrams(): Promise<void> {
  prepareLegacyBlocks()
  const foundTargets = targets()
  if (foundTargets.length === 0) return

  const generation = renderGeneration
  const firstVariant = variantFor(foundTargets[0])
  const mermaid = await loadMermaidWithRetries()
  const scheme = prefersDark() ? 'dark' : 'light'
  if (initializedScheme !== scheme) {
    mermaid.initialize(configForVariant(firstVariant, scheme))
    initializedScheme = scheme
  }

  const usedIds = new Set<string>()
  await Promise.all(
    foundTargets.map((target, index) => renderTarget(mermaid, target, targetId(target, usedIds, index), generation)),
  )
}

export function invalidateMermaidRender(): void {
  renderGeneration += 1
}

function hideRenderFailure(error: unknown): void {
  console.error('Mermaid failed to load:', error)
  targets().forEach((target) => {
    if (target.dataset.mermaidState === 'ready') return
    target.replaceChildren()
    target.setAttribute('aria-hidden', 'true')
    setState(target, 'error')
  })
}

function watchSchemeChanges(): void {
  if (schemeListenerRegistered || typeof window === 'undefined' || !window.matchMedia) return
  schemeListenerRegistered = true
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    renderGeneration += 1
    void renderMermaidDiagrams().catch(hideRenderFailure)
  })
}

export function scheduleMermaidRender(): void {
  if (typeof window === 'undefined' || bootstrapRegistered) return
  bootstrapRegistered = true
  watchSchemeChanges()

  const render = () => {
    void renderMermaidDiagrams().catch(hideRenderFailure)
  }

  // Render eagerly so the diagram does not depend on idle time, which can be
  // postponed indefinitely on busy pages or constrained devices.
  render()
  document.addEventListener('DOMContentLoaded', render, { once: true })

  document.addEventListener('astro:page-load', render)
  document.addEventListener('astro:before-swap', invalidateMermaidRender)
}
