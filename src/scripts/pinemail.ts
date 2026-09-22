function setupInstallTabs(): void {
  const tabs = document.getElementById('pmInstallTabs')
  if (!tabs || tabs.dataset.initialized === 'true') return
  const tabList = tabs.querySelector('[role="tablist"]')
  if (!tabList) return
  const buttons = [...tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
  const panels = [...tabs.querySelectorAll<HTMLElement>('[role="tabpanel"]')]
  if (buttons.length === 0) return
  tabs.dataset.initialized = 'true'

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

function setupPage(): void {
  setupInstallTabs()
  document.querySelectorAll<HTMLDetailsElement>('[data-pm-hook~="pm-faq-item"]').forEach((item) => {
    const plus = item.querySelector<SVGElement>('[data-pm-hook~="pm-faq-toggle-plus"]')
    const minus = item.querySelector<SVGElement>('[data-pm-hook~="pm-faq-toggle-minus"]')
    const sync = () => {
      plus?.toggleAttribute('hidden', item.open)
      minus?.toggleAttribute('hidden', !item.open)
    }
    item.addEventListener('toggle', sync)
    sync()
  })
}

document.addEventListener('astro:page-load', setupPage)
setupPage()
