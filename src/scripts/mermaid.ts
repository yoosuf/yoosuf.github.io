type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
  cancelIdleCallback?: (handle: number) => void
}

let activeArticle: Element | null = null
let disposeCurrent: (() => void) | null = null

async function renderMermaid(isActive: () => boolean): Promise<void> {
  const blocks = [...document.querySelectorAll<HTMLPreElement>('pre[data-language="mermaid"]')]
  if (blocks.length === 0 || !isActive()) return

  let mermaid: (typeof import('mermaid'))['default'] | undefined
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      mermaid = (await import('mermaid')).default
      break
    } catch (error) {
      if (attempt === 2) {
        console.error('Mermaid failed to load:', error)
        return
      }
      await new Promise((resolve) => window.setTimeout(resolve, 350 * (attempt + 1)))
      if (!isActive()) return
    }
  }

  if (!mermaid || !isActive()) return
  mermaid.initialize({ startOnLoad: false, theme: 'default' })
  const originalBlocks = blocks.map((pre) => pre.cloneNode(true) as HTMLPreElement)
  const nodes = blocks.map((pre, index) => {
    const diagram = document.createElement('div')
    diagram.className = 'mermaid'
    diagram.id = `mermaid-${index}`
    diagram.textContent = pre.textContent
    pre.replaceWith(diagram)
    return diagram
  })

  if (!isActive()) return

  try {
    await mermaid.run({ nodes })
  } catch (error) {
    console.error('Mermaid rendering failed:', error)
    if (isActive()) {
      nodes.forEach((node, index) => node.replaceWith(originalBlocks[index]))
    }
  }
}

function setupMermaid(): void {
  const blocks = [...document.querySelectorAll<HTMLPreElement>('pre[data-language="mermaid"]')]
  const article = blocks[0]?.closest('article') ?? null

  if (article === activeArticle && disposeCurrent) return
  disposeCurrent?.()
  disposeCurrent = null
  activeArticle = null
  if (!article) return

  let disposed = false
  let timeout: number | null = null
  let idleHandle: number | null = null
  const idleWindow = window as IdleWindow

  const cleanup = () => {
    disposed = true
    if (idleHandle !== null) idleWindow.cancelIdleCallback?.(idleHandle)
    if (timeout !== null) window.clearTimeout(timeout)
    document.removeEventListener('astro:before-swap', cleanup)
    disposeCurrent = null
    activeArticle = null
  }

  const render = async () => {
    if (disposed) return
    await renderMermaid(() => !disposed)
  }

  document.addEventListener('astro:before-swap', cleanup, { once: true })
  if (idleWindow.requestIdleCallback) {
    idleHandle = idleWindow.requestIdleCallback(() => void render(), { timeout: 3000 })
  } else {
    timeout = window.setTimeout(() => void render(), 1500)
  }
  disposeCurrent = cleanup
  activeArticle = article
}

document.addEventListener('astro:page-load', setupMermaid)
setupMermaid()
