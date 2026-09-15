export function initInfiniteScroll(): void {
  const list = document.querySelector<HTMLUListElement>('[data-infinite-list]')
  const sentinel = document.querySelector<HTMLElement>('[data-infinite-sentinel]')
  if (!list || !sentinel) return

  const summary = document.querySelector<HTMLElement>('[data-blog-summary]')
  const status = document.querySelector<HTMLElement>('[data-infinite-status]')
  const button = document.querySelector<HTMLButtonElement>('[data-infinite-button]')
  const total = Number(list.dataset.total ?? 0)
  const last = Number(sentinel.dataset.last ?? sentinel.dataset.next ?? 2)
  let next = Number(sentinel.dataset.next ?? 2)
  let loading = false
  let finished = false
  let observer: IntersectionObserver | null = null

  const announce = (msg: string) => {
    if (status) status.textContent = msg
  }

  const refreshSummary = () => {
    if (summary) summary.textContent = `Showing 1–${list.children.length} of ${total} posts`
  }

  const finish = () => {
    finished = true
    if (observer) observer.disconnect()
    sentinel.remove()
    if (button) {
      button.disabled = true
      button.textContent = 'All posts loaded'
    }
    announce(`All ${total} posts loaded`)
    refreshSummary()
  }

  const loadNext = async () => {
    if (loading || finished) return
    loading = true
    if (button) {
      button.disabled = true
      button.textContent = 'Loading…'
    }

    try {
      const res = await fetch(`/blog/page/${next}/`, { headers: { accept: 'text/html' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const html = await res.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const items = doc.querySelectorAll('ul.divide-y > li')

      const fragment = document.createDocumentFragment()
      items.forEach((li) => fragment.appendChild(li))
      list.appendChild(fragment)
      next += 1

      announce(`Loaded ${list.children.length} of ${total} posts`)
      refreshSummary()
      if (next > last) finish()
    } catch {
      announce('Couldn’t load more posts. Try the Load more button.')
    } finally {
      loading = false
      if (button) {
        button.disabled = finished
        button.textContent = finished ? 'All posts loaded' : 'Load more posts'
      }
    }
  }

  button?.addEventListener('click', loadNext)

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadNext()
    },
    { rootMargin: '400px 0px' },
  )
  observer.observe(sentinel)
}