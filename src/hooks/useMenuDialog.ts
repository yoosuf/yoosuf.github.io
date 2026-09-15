import { useEffect, type RefObject } from 'react'

interface UseMenuDialogOptions {
  isOpen: boolean
  onClose: () => void
  panelRef: RefObject<HTMLElement | null>
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Standard modal-dialog behaviour for the mobile nav overlay:
 * focus trap, Escape to close, body scroll lock, resize guard,
 * and focus restoration to the trigger on close.
 */
export function useMenuDialog({ isOpen, onClose, panelRef }: UseMenuDialogOptions): void {
  useEffect(() => {
    if (!isOpen) return

    const previousFocus = document.activeElement as HTMLElement | null
    const panel = panelRef.current

    document.body.style.overflow = 'hidden'

    const focusables = () =>
      panel ? (Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) ?? []) : []

    const frame = requestAnimationFrame(() => {
      const first = focusables()[0]
      if (first) first.focus()
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    const mq = window.matchMedia('(min-width: 48rem)')
    const onViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) onClose()
    }
    mq.addEventListener('change', onViewportChange)

    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      mq.removeEventListener('change', onViewportChange)
      previousFocus?.focus()
    }
  }, [isOpen, onClose, panelRef])
}