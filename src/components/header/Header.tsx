import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import * as stylex from '@stylexjs/stylex'
import { NAV, SITE } from '../../config'
import { useMenuDialog } from '../../hooks/useMenuDialog'
import { headerStyles } from './header.stylex'
import { a11y } from '../ui/primitives'

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

  useEffect(() => {
    if (!menuOpen || !panelRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    panelRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, easing: 'ease-out', fill: 'both' })
    panelRef.current.querySelectorAll<HTMLElement>('[data-menu-link]').forEach((link, index) => {
      link.animate(
        [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: 400, delay: 80 + index * 60, easing: 'ease-out', fill: 'both' },
      )
    })
  }, [menuOpen])

  const menu = () => {
    const overlayProps = stylex.props(headerStyles.menuOverlay)

    return (
    <div
      {...overlayProps}
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
    >
      <h2 id="mobile-menu-title" {...stylex.props(a11y.srOnly)}>
        Menu
      </h2>

      <div {...stylex.props(headerStyles.container)}>
        <span {...stylex.props(headerStyles.menuTitle)}>{SITE.title}</span>
        <button
          type="button"
          {...stylex.props(headerStyles.iconBtn)}
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

      <nav aria-label="Mobile" {...stylex.props(headerStyles.menuNav)}>
        <ul {...stylex.props(headerStyles.menuList)}>
          {NAV.map((item, index) => (
            <li
              {...stylex.props(headerStyles.menuLinkItem)}
              data-menu-link
              key={item.link}
              style={{ ['--i' as string]: index }}
            >
              <a
                href={item.link}
                aria-current={isActive(item.link, currentPath) ? 'page' : undefined}
                {...stylex.props(
                  headerStyles.menuLink,
                  isActive(item.link, currentPath) && headerStyles.menuLinkActive,
                )}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div {...stylex.props(headerStyles.container, headerStyles.overlayCaption)}>
        {SITE.description}
      </div>
    </div>
    )
  }

  return (
    <header {...stylex.props(headerStyles.bar)}>
      <div {...stylex.props(headerStyles.container)}>
        <a href="/" {...stylex.props(headerStyles.brand)}>
          {SITE.title}
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" {...stylex.props(headerStyles.desktopNav)}>
          <ul {...stylex.props(headerStyles.desktopList)}>
            {NAV.map((item) => (
              <li key={item.link}>
                <a
                  href={item.link}
                  aria-current={isActive(item.link, currentPath) ? 'page' : undefined}
                  {...stylex.props(
                    headerStyles.desktopLink,
                    isActive(item.link, currentPath) && headerStyles.desktopLinkActive,
                  )}
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
          {...stylex.props(headerStyles.iconBtn, headerStyles.onlyMobile)}
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

      {menuOpen && menu()}
    </header>
  )
}
