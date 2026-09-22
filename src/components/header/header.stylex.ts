import * as stylex from '@stylexjs/stylex'
import { colors, letterSpacing, radii, space, typeScale, weights } from '../../styles/tokens.stylex'

// Site header chrome: bar + brand + desktop nav + hamburger + full-page
// mobile menu dialog. Breakpoint parity with the old `md:hidden`/`md:block`
// (min-width: 48rem). Pure tokens — no brand values.
export const headerStyles = stylex.create({
  bar: {
    backgroundColor: colors.bg,
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },

  container: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginInlineEnd: 'auto',
    marginInlineStart: 'auto',
    maxWidth: '68rem',
    paddingBlock: space['4'],
    paddingInlineEnd: { default: '1.25rem', '@media (min-width: 40rem)': space['8'] },
    paddingInlineStart: { default: '1.25rem', '@media (min-width: 40rem)': space['8'] },
    width: '100%',
  },

  brand: {
    color: colors.text,
    fontSize: '1.125rem',
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.tight,
    textDecorationLine: 'none',
  },

  desktopNav: {
    display: 'none',
    '@media (min-width: 48rem)': {
      display: 'block',
    },
  },

  desktopList: {
    alignItems: 'center',
    display: 'flex',
    gap: space['5'],
    listStyleType: 'none',
    marginBlock: 0,
    paddingInlineStart: 0,
  },

  desktopLink: {
    color: colors.textMuted,
    fontSize: '0.9rem',
    textDecorationLine: 'none',
    transitionDuration: '0.15s',
    transitionProperty: 'color',
    ':hover': {
      color: colors.text,
    },
  },

  desktopLinkActive: {
    color: colors.text,
    textDecorationColor: colors.border,
    textDecorationLine: 'underline',
    textDecorationThickness: 1,
    textUnderlineOffset: 4,
  },

  iconBtn: {
    alignItems: 'center',
    borderRadius: radii.md,
    color: colors.text,
    display: 'flex',
    height: '2.5rem',
    justifyContent: 'center',
    width: '2.5rem',
    transitionDuration: '0.15s',
    transitionProperty: 'background-color,color',
    ':hover': {
      backgroundColor: colors.wash,
    },
  },

  onlyMobile: {
    '@media (min-width: 48rem)': {
      display: 'none',
    },
  },

  menuOverlay: {
    backgroundColor: colors.bg,
    display: 'flex',
    flexDirection: 'column',
    inset: 0,
    position: 'fixed',
    zIndex: 50,
    '@media (min-width: 48rem)': {
      display: 'none',
    },
  },

  menuTitle: {
    color: colors.text,
    fontSize: '1.125rem',
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.tight,
  },

  menuNav: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
  },

  menuList: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    listStyleType: 'none',
    marginBlock: 0,
    paddingInlineStart: 0,
  },

  menuLink: {
    color: colors.text,
    fontSize: typeScale.xl,
    textDecorationLine: 'none',
    ':hover': {
      color: colors.accent,
    },
  },

  menuLinkItem: {
  },

  menuLinkActive: {
    color: colors.accent,
  },

  overlayCaption: {
    color: colors.textDim,
    fontSize: '0.8rem',
    paddingBlockEnd: space['6'],
  },
})
