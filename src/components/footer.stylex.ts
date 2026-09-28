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
    gap: { default: space['8'], '@media (min-width: 56rem)': space['12'] },
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      // Identity keeps a third of the width; the link rows take the rest so an
      // inline group like `Home · Services · Blog · About` stays on one line.
      '@media (min-width: 56rem)': 'minmax(0, 1fr) minmax(0, 1.7fr)',
    },
  },

  identity: {
    maxWidth: '26rem',
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
    marginBlock: '0.625rem 0',
    textWrap: 'pretty',
  },

  groups: {
    display: 'flex',
    flexDirection: 'column',
    gap: space['2'],
    marginBlock: 0,
    minWidth: 0,
  },

  /** Label on the left, links flowing on the right. Stacked on narrow screens
   *  where a 6rem label column would leave the links too little room. */
  group: {
    display: 'grid',
    columnGap: '1rem',
    rowGap: '0.125rem',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 30rem)': '6rem minmax(0, 1fr)',
    },
    marginBlock: 0,
    minWidth: 0,
  },

  groupLabel: {
    color: colors.textFaint,
    fontSize: '0.75rem',
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.wide,
    lineHeight: '2rem',
    marginBlock: 0,
    textTransform: 'uppercase',
  },

  groupLinks: {
    alignItems: 'baseline',
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '0.25rem 1.125rem',
    marginBlock: 0,
    minWidth: 0,
  },

  /** 2rem keeps every target comfortably past the 24px minimum without
   *  spending 44px a row on a two-word label. */
  groupLink: {
    alignItems: 'center',
    color: colors.textMuted,
    display: 'inline-flex',
    fontSize: '0.9rem',
    lineHeight: 1.4,
    maxWidth: '100%',
    minHeight: '2rem',
    overflowWrap: 'anywhere',
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
