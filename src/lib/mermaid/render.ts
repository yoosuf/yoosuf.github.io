import { configForVariant, type MermaidVariant } from './config'

type MermaidApi = (typeof import('mermaid'))['default']
type MermaidTarget = HTMLElement & { dataset: DOMStringMap }
type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
  cancelIdleCallback?: (handle: number) => void
}

let mermaidPromise: Promise<MermaidApi> | null = null
let initialized = false
let bootstrapRegistered = false
let renderGeneration = 0

function targets(): MermaidTarget[] {
  return [...document.querySelectorAll<MermaidTarget>('[data-mermaid-target]')]
}

function variantFor(target: MermaidTarget): MermaidVariant {
  return target.closest<HTMLElement>('[data-mermaid-variant]')?.dataset.mermaidVariant === 'marker'
    ? 'marker'
    : 'pencil'
}

async function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= import('mermaid').then(({ default: mermaid }) => mermaid)
  return mermaidPromise
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
  if (generation !== renderGeneration || target.dataset.mermaidState === 'ready') return

  const source = sourceFor(target)
  if (!source.trim()) return
  const renderSource = normalizeDiagramSource(source)
  setState(target, 'pending')

  try {
    const { svg, bindFunctions } = await mermaid.render(id, renderSource, target)
    if (generation !== renderGeneration || !target.isConnected) return
    target.innerHTML = svg
    bindFunctions?.(target)
    setState(target, 'ready')
  } catch (error) {
    if (generation !== renderGeneration || !target.isConnected) return
    console.error(`Mermaid diagram ${id} failed to render:`, error)
    target.textContent = 'Unable to render diagram. Check the Mermaid syntax.'
    target.setAttribute('aria-live', 'polite')
    setState(target, 'error')
  }
}

export async function renderMermaidDiagrams(): Promise<void> {
  prepareLegacyBlocks()
  const foundTargets = targets()
  if (foundTargets.length === 0) return

  const generation = renderGeneration
  const firstVariant = variantFor(foundTargets[0])
  const mermaid = await loadMermaid()
  if (!initialized) {
    mermaid.initialize(configForVariant(firstVariant))
    initialized = true
  }

  const usedIds = new Set<string>()
  await Promise.all(
    foundTargets.map((target, index) => renderTarget(mermaid, target, targetId(target, usedIds, index), generation)),
  )
}

export function invalidateMermaidRender(): void {
  renderGeneration += 1
}

export function scheduleMermaidRender(): void {
  if (typeof window === 'undefined' || bootstrapRegistered) return
  bootstrapRegistered = true

  const idleWindow = window as IdleWindow
  const render = () => void renderMermaidDiagrams()
  if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(render, { timeout: 2500 })
  } else {
    window.setTimeout(render, 300)
  }

  document.addEventListener('astro:page-load', render)
  document.addEventListener('astro:before-swap', invalidateMermaidRender)
}
