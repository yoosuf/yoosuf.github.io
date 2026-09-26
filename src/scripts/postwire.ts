/**
 * Wires one tab group: roving tabindex, arrow/Home/End navigation, and
 * `aria-selected` / `hidden` kept in sync on the panels.
 */
function setupTabGroup(root: HTMLElement | null): void {
  if (!root || root.dataset.initialized === 'true') return
  const tabList = root.querySelector('[role="tablist"]')
  if (!tabList) return
  const buttons = [...tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
  const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')]
  if (buttons.length === 0) return
  root.dataset.initialized = 'true'

  const panelBy = (name: string) => panels.find((panel) => panel.dataset.tabname === name) ?? null
  const select = (id: string) => {
    buttons.forEach((button) => {
      const selected = button.id === id
      button.setAttribute('aria-selected', String(selected))
      button.tabIndex = selected ? 0 : -1
      panelBy(button.dataset.tabname ?? '')?.toggleAttribute('hidden', !selected)
    })
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => select(button.id))
    button.addEventListener('keydown', (event) => {
      const index = buttons.indexOf(button)
      let next: HTMLButtonElement | undefined
      if (event.key === 'ArrowRight') next = buttons[(index + 1) % buttons.length]
      else if (event.key === 'ArrowLeft') next = buttons[(index - 1 + buttons.length) % buttons.length]
      else if (event.key === 'Home') next = buttons[0]
      else if (event.key === 'End') next = buttons[buttons.length - 1]
      if (!next) return
      event.preventDefault()
      select(next.id)
      next.focus()
    })
  })

  // Panels ship with `hidden` in the markup; StyleX sets `display` on them, so
  // the attribute is enforced in BaseLayout rather than by the UA sheet alone.
  select(buttons.find((button) => button.getAttribute('aria-selected') === 'true')?.id ?? buttons[0].id)
}

let copyBound = false

function setupInstallTabs(): void {
  const tabs = document.getElementById('pmInstallTabs')
  if (!tabs) return
  setupTabGroup(tabs)
  if (copyBound) return
  copyBound = true

  tabs.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const button = target.closest<HTMLButtonElement>('[data-pm-hook~="pm-code-copy"]')
    const codebox = button?.closest('[data-pm-hook~="pm-codebox"]')
    const pre = codebox?.querySelector('pre')
    if (!button || !pre) return
    const done = () => {
      button.dataset.copied = 'true'
      button.textContent = 'Copied'
      window.setTimeout(() => {
        delete button.dataset.copied
        button.textContent = 'Copy'
      }, 2000)
    }
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(pre.innerText).then(done).catch(() => {})
      return
    }
    const textarea = document.createElement('textarea')
    textarea.value = pre.innerText
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      done()
    } catch {
      // Clipboard access is optional; the copy control remains usable otherwise.
    }
    textarea.remove()
  })
}

function setupMcpTabs(): void {
  setupTabGroup(document.getElementById('pmMcpTabs'))
}

function setupDocSearch(): void {
  const root = document.querySelector<HTMLElement>('[data-pm-hook="pm-doc-search"]')
  if (!root || root.dataset.initialized === 'true') return
  const input = root.querySelector<HTMLInputElement>('[data-pm-hook="pm-doc-search-input"]')
  const count = root.querySelector<HTMLElement>('[data-pm-hook="pm-doc-search-count"]')
  const index = root.parentElement?.querySelector<HTMLElement>('[data-pm-hook="pm-doc-index"]')
  const empty = root.parentElement?.querySelector<HTMLElement>('[data-pm-hook="pm-doc-search-empty"]')
  if (!input || !index) return

  const rows = [...index.querySelectorAll<HTMLElement>('[data-pm-hook="pm-doc-index-item"]')]
  if (rows.length === 0) return
  root.dataset.initialized = 'true'

  // Precompute the haystack once. Paths are matched with separators stripped
  // so "api wait" finds "/api/wait".
  const haystacks = rows.map((row) =>
    (row.textContent ?? '')
      .toLowerCase()
      .replace(/[/_.:-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  )

  const apply = (raw: string) => {
    const terms = raw.toLowerCase().split(/\s+/).filter(Boolean)
    let shown = 0
    rows.forEach((row, index) => {
      // Every term must appear, so extra words narrow rather than widen.
      const match = terms.every((term) => haystacks[index].includes(term))
      row.hidden = !match
      if (match) shown++
    })
    if (count) {
      count.textContent = terms.length === 0 ? `${rows.length} endpoints` : `${shown} of ${rows.length} endpoints`
    }
    empty?.toggleAttribute('hidden', shown > 0)
  }

  input.addEventListener('input', () => apply(input.value))
  input.addEventListener('search', () => apply(input.value))
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || input.value === '') return
    event.preventDefault()
    input.value = ''
    apply('')
  })

  // Progressive enhancement: only now does the control exist for the visitor.
  root.removeAttribute('hidden')
  apply('')
}

function setupPage(): void {
  setupInstallTabs()
  setupMcpTabs()
  setupDocSearch()
}

document.addEventListener('astro:page-load', setupPage)
setupPage()
