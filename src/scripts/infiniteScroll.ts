let disposeCurrent: (() => void) | null = null
let activeList: Element | null = null

export function initInfiniteScroll(): void {
  const list = document.querySelector<HTMLUListElement>('[data-infinite-list]')
  const sentinel = document.querySelector<HTMLElement>('[data-infinite-sentinel]')

  if (list === activeList && disposeCurrent) return
  disposeCurrent?.()
  disposeCurrent = null
  activeList = null

  if (!list || !sentinel) return

  const summary = document.querySelector<HTMLElement>('[data-blog-summary]')
  const status = document.querySelector<HTMLElement>('[data-infinite-status]')
  const button = document.querySelector<HTMLButtonElement>('[data-infinite-button]')
  const total = Number(list.dataset.total ?? 0)
  const last = Number(sentinel.dataset.last ?? sentinel.dataset.next ?? 2)
  let next = Number(sentinel.dataset.next ?? 2)
  let loading = false
  let finished = false
  let disposed = false
  let observer: IntersectionObserver | null = null
  const controller = new AbortController()

  const announce = (message: string) => {
    if (status) status.textContent = message
  }

  const refreshSummary = () => {
    if (summary) summary.textContent = `Showing 1–${list.children.length} of ${total} posts`
  }

  const finish = () => {
    finished = true
    observer?.disconnect()
    sentinel.remove()
    if (button) {
      button.disabled = true
      button.textContent = 'All posts loaded'
    }
    announce(`All ${total} posts loaded`)
    refreshSummary()
  }

  const loadNext = async () => {
    if (disposed || loading || finished) return
    loading = true
    if (button) {
      button.disabled = true
      button.textContent = 'Loading…'
    }

    try {
      const response = await fetch(`/blog/page/${next}/`, {
        headers: { accept: 'text/html' },
        signal: controller.signal,
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const html = await response.text()
      if (disposed) return
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const items = doc.querySelectorAll('ul.divide-y > li')
      const fragment = document.createDocumentFragment()
      items.forEach((item) => fragment.appendChild(item))
      list.appendChild(fragment)
      next += 1
      announce(`Loaded ${list.children.length} of ${total} posts`)
      refreshSummary()
      if (next > last) finish()
    } catch (error) {
      if (!disposed && !(error instanceof DOMException && error.name === 'AbortError')) {
        announce('Couldn’t load more posts. Try the Load more button.')
      }
    } finally {
      loading = false
      if (!disposed && button) {
        button.disabled = finished
        button.textContent = finished ? 'All posts loaded' : 'Load more posts'
      }
    }
  }

  button?.addEventListener('click', loadNext)
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadNext()
    },
    { rootMargin: '400px 0px' },
  )
  observer.observe(sentinel)

  const cleanup = () => {
    disposed = true
    controller.abort()
    observer?.disconnect()
    button?.removeEventListener('click', loadNext)
    document.removeEventListener('astro:before-swap', cleanup)
    disposeCurrent = null
    activeList = null
  }

  document.addEventListener('astro:before-swap', cleanup, { once: true })
  disposeCurrent = cleanup
  activeList = list
}

document.addEventListener('astro:page-load', initInfiniteScroll)
initInfiniteScroll()
