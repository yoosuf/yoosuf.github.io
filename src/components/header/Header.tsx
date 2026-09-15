import { useCallback, useRef, useState, type ReactNode } from 'react'
import { NAV, SITE } from '../../config'
import { useMenuDialog } from '../../hooks/useMenuDialog'

function isActive(href: string, path: string): boolean {
  if (href === '/') return path === '/' || path === ''
  return path === href || path.startsWith(href)
}

/**
 * Site header with a full-page mobile menu.
 * The mobile menu is a modal dialog: focus-trapped, Escape-to-close,
 * ARIA modal semantics, and focus restored to the trigger on close.
 *
 * `currentPath` is provided by Astro at build time (server-rendered) so the
 * active nav state matches the hydration output exactly.
 */
interface HeaderProps {
  currentPath: string
}

export default function Header({ currentPath }: HeaderProps): ReactNode {
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const openMenu = () => {
    triggerRef.current = document.activeElement as HTMLButtonElement | null
    setMenuOpen(true)
  }

  useMenuDialog({ isOpen: menuOpen, onClose: closeMenu, panelRef })

  return (
    <header className="border-b border-line bg-paper">
      <div className="site-container flex items-center justify-between py-4">
        <a href="/" className="text-[1.125rem] font-semibold tracking-tight text-ink no-underline">
          {SITE.title}
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-x-5">
            {NAV.map((item) => (
              <li key={item.link}>
                <a
                  href={item.link}
                  aria-current={isActive(item.link, currentPath) ? 'page' : undefined}
                  className="text-[0.9rem] text-mid no-underline transition-colors hover:text-ink aria-[current='page']:text-ink aria-[current='page']:underline underline-offset-4 decoration-line"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger */}
        <button
          ref={triggerRef}
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-wash md:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={openMenu}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          className="y-menu-overlay fixed inset-0 z-50 flex flex-col bg-paper md:hidden"
        >
          <h2 id="mobile-menu-title" className="sr-only">
            Menu
          </h2>

          <div className="site-container flex items-center justify-between py-4">
            <span className="text-[1.125rem] font-semibold tracking-tight text-ink">
              {SITE.title}
            </span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-wash"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 items-center justify-center">
            <ul className="flex flex-col items-center gap-7">
              {NAV.map((item, index) => (
                <li
                  className="y-menu-link"
                  key={item.link}
                  style={{ ['--i' as string]: index }}
                >
                  <a
                    href={item.link}
                    aria-current={isActive(item.link, currentPath) ? 'page' : undefined}
                    className="text-[1.625rem] text-ink no-underline hover:text-accent aria-[current='page']:text-accent"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-container pb-6 text-[0.8rem] text-sub">{SITE.description}</div>
        </div>
      )}
    </header>
  )
}