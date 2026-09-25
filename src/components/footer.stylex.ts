import * as stylex from '@stylexjs/stylex'
import { colors, letterSpacing, lineHeights, space, weights } from '../styles/tokens.stylex'

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
    paddingBlock: { default: space['10'], '@media (min-width: 40rem)': space['12'] },
    paddingInlineEnd: { default: '1.25rem', '@media (min-width: 40rem)': space['8'] },
    paddingInlineStart: { default: '1.25rem', '@media (min-width: 40rem)': space['8'] },
    width: '100%',
  },

  layout: {
    display: 'grid',
    gap: { default: space['8'], '@media (min-width: 40rem)': space['10'] },
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 40rem)': 'minmax(0, 1.5fr) repeat(2, minmax(8rem, 0.75fr))',
    },
  },

  identity: {
    maxWidth: '34rem',
    minWidth: 0,
  },

  brand: {
    color: colors.text,
    fontSize: '1.125rem',
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.snug,
    marginBlock: 0,
  },

  brandLink: {
    alignItems: 'center',
    color: colors.text,
    display: 'inline-flex',
    minHeight: '2.75rem',
    textDecorationLine: 'none',
    transitionDuration: '0.15s',
    transitionProperty: 'color',
    ':hover': {
      color: colors.accent,
      textDecorationLine: 'underline',
      textDecorationThickness: 1,
      textUnderlineOffset: 4,
    },
  },

  description: {
    color: colors.textDim,
    fontSize: '0.9rem',
    lineHeight: lineHeights.relaxed,
    marginBlock: '0.75rem 0',
    maxWidth: '32rem',
    textWrap: 'pretty',
  },

  navGroup: {
    minWidth: 0,
  },

  groupTitle: {
    color: colors.textDim,
    fontSize: '0.75rem',
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.wide,
    lineHeight: 1.5,
    marginBlock: 0,
    textTransform: 'uppercase',
  },

  navList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: { default: '0.25rem 1rem', '@media (min-width: 40rem)': '0.125rem 0' },
    listStyleType: 'none',
    marginBlock: 0,
    minWidth: 0,
    paddingInlineStart: 0,
    '@media (min-width: 40rem)': {
      flexDirection: 'column',
      flexWrap: 'nowrap',
    },
  },

  navItem: {
    maxWidth: '100%',
    minWidth: 0,
  },

  navLink: {
    alignItems: 'center',
    color: colors.textMuted,
    display: 'inline-flex',
    fontSize: '0.9rem',
    lineHeight: 1.4,
    maxWidth: '100%',
    minHeight: '2.75rem',
    overflowWrap: 'anywhere',
    paddingBlock: '0.5rem',
    paddingInline: { default: 0, '@media (min-width: 40rem)': '0.25rem' },
    textDecorationLine: 'none',
    transitionDuration: '0.15s',
    transitionProperty: 'color',
    ':hover': {
      color: colors.text,
      textDecorationLine: 'underline',
      textDecorationThickness: 1,
      textUnderlineOffset: 4,
    },
  },

  bottom: {
    alignItems: { default: 'flex-start', '@media (min-width: 48rem)': 'center' },
    borderTopColor: colors.border,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: { default: 'column', '@media (min-width: 48rem)': 'row' },
    gap: '0.25rem 1.5rem',
    justifyContent: { default: 'flex-start', '@media (min-width: 48rem)': 'space-between' },
    marginBlockStart: space['10'],
    paddingBlockStart: space['4'],
  },

  copyright: {
    color: colors.textDim,
    fontSize: '0.8rem',
    lineHeight: 1.6,
    marginBlock: 0,
  },

  utilityList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0 1rem',
    listStyleType: 'none',
    marginBlock: 0,
    paddingInlineStart: 0,
  },

  utilityItem: {
    maxWidth: '100%',
    minWidth: 0,
  },

  utilityLink: {
    alignItems: 'center',
    color: colors.textDim,
    display: 'inline-flex',
    fontSize: '0.8rem',
    minHeight: '2.75rem',
    overflowWrap: 'anywhere',
    paddingBlock: '0.5rem',
    textDecorationLine: 'underline',
    textUnderlineOffset: 3,
    transitionDuration: '0.15s',
    transitionProperty: 'color',
    ':hover': {
      color: colors.text,
    },
  },
})
