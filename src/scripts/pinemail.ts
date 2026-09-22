type Cleanup = () => void

let activeFlow: Element | null = null
let disposeFlow: Cleanup | null = null

function setupFlow(): void {
  const flow = document.querySelector<HTMLElement>('.pm-flow')

  if (flow === activeFlow && disposeFlow) return
  disposeFlow?.()
  activeFlow = null
  disposeFlow = null

  if (!flow) return

  const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  if (motion?.matches) return

  const app = flow.querySelector<HTMLElement>('.pm-flow-app')
  const core = flow.querySelector<HTMLElement>('.pm-flow-core')
  const consume = flow.querySelector<HTMLElement>('.pm-flow-consume')
  const outArrow = flow.querySelector<HTMLElement>('.pm-arrow-out')
  const inArrow = flow.querySelector<HTMLElement>('.pm-arrow-in')
  const appMsg = app?.querySelector<HTMLElement>('.pm-flow-status-msg')
  const coreMsg = core?.querySelector<HTMLElement>('.pm-flow-status-msg')
  const conMsg = consume?.querySelector<HTMLElement>('.pm-flow-status-msg')
  const conPill = consume?.querySelector<HTMLElement>('.pm-flow-status')
  const logEl = flow.querySelector<HTMLOListElement>('.pm-flow-log')
  const countEl = flow.querySelector<HTMLElement>('.pm-flow-log-count')

  if (
    !app ||
    !core ||
    !consume ||
    !outArrow ||
    !inArrow ||
    !appMsg ||
    !coreMsg ||
    !conMsg ||
    !conPill ||
    !logEl ||
    !countEl
  ) {
    return
  }

  const logPool: Array<[HTMLLIElement, HTMLElement, HTMLSpanElement]> = []
  for (let i = 0; i < 6; i += 1) {
    const li = document.createElement('li')
    li.className = 'pm-flow-log-line'
    const time = document.createElement('time')
    time.textContent = '--:--:--'
    const text = document.createElement('span')
    li.append(time, text)
    logEl.appendChild(li)
    logPool.push([li, time, text])
  }

  let logIndex = 0
  let sequence = 421
  let inbox = 0
  let active = 0
  let timer: number | null = null
  let observer: IntersectionObserver | null = null
  const pendingTimers = new Set<number>()
  const animations = new Set<Animation>()
  const currentAnimations = new WeakMap<Element, Animation>()
  const pmPage = document.querySelector<HTMLElement>('.pm-page')
  const styles = pmPage ? getComputedStyle(pmPage) : null
  const bgSoft = styles?.getPropertyValue('--pm-accent-soft').trim() || '#d1fae5'
  const animationCache = new WeakMap<HTMLElement, { bg: string; shadow: string }>()

  const schedule = (callback: () => void, delay: number): number => {
    const id = window.setTimeout(() => {
      pendingTimers.delete(id)
      callback()
    }, delay)
    pendingTimers.add(id)
    return id
  }

  const animate = (
    node: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: KeyframeAnimationOptions,
  ): Animation => {
    const animation = node.animate(keyframes, options)
    animations.add(animation)
    const forget = () => animations.delete(animation)
    animation.addEventListener('finish', forget, { once: true })
    animation.addEventListener('cancel', forget, { once: true })
    return animation
  }

  const pad = (value: number) => (value < 10 ? `0${value}` : String(value))
  const now = () => {
    const date = new Date()
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }
  const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

  const logLine = (message: string, hit = false) => {
    const [li, time, text] = logPool[logIndex]
    logIndex = (logIndex + 1) % logPool.length
    li.classList.toggle('pm-log-hit', hit)
    time.textContent = now()
    text.textContent = message
    currentAnimations.get(li)?.cancel()
    currentAnimations.set(li, animate(
      li,
      [
        { opacity: 0.1, transform: 'translateY(4px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
    ))
    logEl.scrollTop = logEl.scrollHeight
  }

  const setStatus = (node: HTMLElement, text: string) => {
    node.textContent = text
  }

  const flash = (node: HTMLElement) => {
    let rest = animationCache.get(node)
    if (!rest) {
      const computed = getComputedStyle(node)
      rest = { bg: computed.backgroundColor, shadow: computed.boxShadow }
      animationCache.set(node, rest)
    }
    const ringBase = rest.shadow && rest.shadow !== 'none' ? `, ${rest.shadow}` : ''
    currentAnimations.get(node)?.cancel()
    currentAnimations.set(node, animate(
      node,
      [
        {
          backgroundColor: bgSoft,
          boxShadow: `0 0 0 5px rgba(16, 185, 129, 0.22)${ringBase}`,
        },
        {
          backgroundColor: bgSoft,
          boxShadow: `0 0 0 3px rgba(16, 185, 129, 0.12)${ringBase}`,
          offset: 0.7,
        },
        { backgroundColor: rest.bg, boxShadow: rest.shadow },
      ],
      { duration: 1500, easing: 'ease-out', fill: 'none' },
    ))
  }

  const runPacket = (arrow: HTMLElement, pop: boolean) => {
    const packet = arrow.querySelector<HTMLElement>('.pm-flow-packet')
    if (!packet) return
    currentAnimations.get(packet)?.cancel()
    const horizontal = getComputedStyle(arrow).getPropertyValue('--pm-flow-axis').trim() === 'x'
    const axis = horizontal ? 'translateX' : 'translateY'
    const packetAnimation = animate(
      packet,
      [
        { transform: `${axis}(-34px)`, opacity: 1 },
        { transform: `${axis}(34px)`, opacity: 1 },
      ],
      { duration: 340, easing: 'cubic-bezier(0.33, 1, 0.68, 1)', fill: 'none' },
    )
    currentAnimations.set(packet, packetAnimation)
    packetAnimation.onfinish = () => {
      if (!pop) return
      const svg = arrow.querySelector<SVGElement>('.pm-flow-arrow-icon svg')
      if (!svg) return
      animate(
        svg,
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.14)', offset: 0.4 },
          { transform: 'scale(1)' },
        ],
        { duration: 320, easing: 'ease-out', fill: 'none' },
      )
    }
  }

  const updateCount = () => {
    countEl.textContent = `inbox ${inbox}`
  }

  const send = () => {
    active += 1
    const id = String(sequence++)
    const channel = Math.random() < 0.6 ? 'SMTP' : 'Twilio'
    const otp = String(100000 + Math.floor(Math.random() * 900000))
    const spam = (0.01 + Math.random() * 0.08).toFixed(2)
    const agent = 7700 + Math.floor(Math.random() * 200)
    const isLink = Math.random() < 0.35

    setStatus(appMsg, `sending ${id}`)
    flash(app)
    runPacket(outArrow, true)

    schedule(() => {
      setStatus(coreMsg, 'storing')
      flash(core)
      logLine(`${channel} ${id} · received`)
      inbox += 1
      updateCount()
    }, 480)

    schedule(() => {
      setStatus(coreMsg, 'parsing')
      logLine(`extract → ${isLink ? `/verify?t=${otp.slice(0, 4)}` : `OTP ${otp}`}`, true)
    }, 900)

    schedule(() => {
      logLine(`analysis · spam ${spam}`)
      setStatus(coreMsg, 'ready')
    }, 1320)

    schedule(() => {
      runPacket(inArrow, true)
      flash(consume)
      conPill.classList.remove('pm-status-polling')
      setStatus(conMsg, `got ${id}`)
      logLine(`delivered → agent ${agent}`)
      if (inbox > 0) inbox -= 1
      updateCount()
    }, 1680)

    schedule(() => {
      conPill.classList.add('pm-status-polling')
      setStatus(conMsg, 'long-polling…')
      active -= 1
      if (active === 0) scheduleNext()
    }, 2380)
  }

  const burst = () => {
    const count = 2 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i += 1) schedule(send, i * 320)
  }

  const scheduleNext = () => {
    let wait = randomBetween(2400, 6200)
    if (Math.random() < 0.25) wait = randomBetween(700, 1500)
    timer = schedule(() => {
      timer = null
      if (Math.random() < 0.4) burst()
      else send()
    }, wait)
  }

  let started = false
  const drive = () => {
    if (started) {
      if (active === 0 && timer === null) scheduleNext()
      return
    }
    started = true
    schedule(send, 900)
  }

  const onMotionChange = (event: MediaQueryListEvent) => {
    if (!event.matches) return
    pendingTimers.forEach((id) => window.clearTimeout(id))
    pendingTimers.clear()
    timer = null
    animations.forEach((animation) => animation.cancel())
    animations.clear()
  }

  const cleanup = () => {
    pendingTimers.forEach((id) => window.clearTimeout(id))
    pendingTimers.clear()
    if (observer) observer.disconnect()
    motion?.removeEventListener('change', onMotionChange)
    animations.forEach((animation) => animation.cancel())
    animations.clear()
    document.removeEventListener('astro:before-swap', cleanup)
    activeFlow = null
    disposeFlow = null
  }

  document.addEventListener('astro:before-swap', cleanup, { once: true })
  if (window.IntersectionObserver) {
    observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting)
      if (visible) drive()
      else if (timer !== null) {
        window.clearTimeout(timer)
        pendingTimers.delete(timer)
        timer = null
      }
    }, { threshold: 0.15 })
    observer.observe(flow)
  } else {
    drive()
  }
  motion?.addEventListener('change', onMotionChange)

  activeFlow = flow
  disposeFlow = cleanup
}

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
    const button = target.closest<HTMLButtonElement>('.pm-code-copy')
    const codebox = button?.closest('.pm-codebox')
    const pre = codebox?.querySelector('pre')
    if (!button || !pre) return
    const done = () => {
      button.classList.add('is-copied')
      button.textContent = 'Copied'
      window.setTimeout(() => {
        button.classList.remove('is-copied')
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
  setupFlow()
  setupInstallTabs()
}

document.addEventListener('astro:page-load', setupPage)
setupPage()
