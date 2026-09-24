import * as stylex from '@stylexjs/stylex'
import { colors, space } from '../styles/tokens.stylex'

// Footer chrome: legal line + utility nav. Links opt into their own colour
// explicitly because there is no global reset layer.
export const footerStyles = stylex.create({
  bar: {
    backgroundColor: colors.bg,
    borderTopColor: colors.border,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
  },

  container: {
    marginInlineEnd: 'auto',
    marginInlineStart: 'auto',
    maxWidth: '68rem',
    paddingBlock: space['10'],
    paddingInlineEnd: { default: '1.25rem', '@media (min-width: 40rem)': space['8'] },
    paddingInlineStart: { default: '1.25rem', '@media (min-width: 40rem)': space['8'] },
    width: '100%',
  },

  row: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem 1.5rem',
    justifyContent: 'space-between',
  },

  legal: {
    color: colors.textDim,
    fontSize: '0.8rem',
    lineHeight: 1.7,
    marginBlock: 0,
  },

  brandLink: {
    color: colors.text,
    textDecorationLine: 'none',
    ':hover': {
      textDecorationLine: 'underline',
    },
  },

  sep: {
    color: colors.textFaint,
    marginInlineEnd: '0.375rem',
    marginInlineStart: '0.375rem',
  },

  legalLink: {
    paddingBlock: '0.375rem',
    ':hover': {
      color: colors.text,
    },
  },

  nav: {
    alignItems: 'center',
    color: colors.textMuted,
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: '0.825rem',
    gap: '0.5rem 1.25rem',
    justifyContent: 'flex-end',
    marginBlockEnd: 0,
    marginBlockStart: 0,
    marginInlineStart: 'auto',
  },

  navLink: {
    paddingBlock: '0.375rem',
    textDecorationLine: 'none',
    ':hover': {
      color: colors.text,
    },
  },
})
