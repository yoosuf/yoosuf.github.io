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
    paddingBlock: { default: space['12'], '@media (min-width: 40rem)': space['16'] },
    paddingInlineEnd: { default: '1.25rem', '@media (min-width: 40rem)': space['8'] },
    paddingInlineStart: { default: '1.25rem', '@media (min-width: 40rem)': space['8'] },
    width: '100%',
  },

  layout: {
    display: 'grid',
    gap: { default: space['10'], '@media (min-width: 48rem)': space['12'] },
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      // Identity keeps a third of the width; the link rows take the rest so an
      // inline group like `Home · Services · Blog · About` stays on one line.
      // 48rem, not 56rem — at 768px a single column throws away 300px of
      // whitespace next to 146px of links and doubles the height for nothing.
      '@media (min-width: 48rem)': 'minmax(0, 1fr) minmax(0, 1.7fr)',
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
    minHeight: '2.5rem',
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
    fontSize: '0.9375rem',
    lineHeight: lineHeights.relaxed,
    marginBlock: '0.75rem 0',
    textWrap: 'pretty',
  },

  groups: {
    display: 'flex',
    flexDirection: 'column',
    // The groups are separate things, not a run-on. 8px between them made the
    // three of them read as one dense block; 20px lets the eye finish one and
    // start the next.
    gap: space['5'],
    marginBlock: 0,
    minWidth: 0,
  },

  /** Label on the left, links flowing on the right. Stacked on narrow screens
   *  where a 7rem label column would leave the links too little room. */
  group: {
    display: 'grid',
    alignItems: 'baseline',
    columnGap: '1.25rem',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 34rem)': '7rem minmax(0, 1fr)',
    },
    marginBlock: 0,
    minWidth: 0,
  },

  groupLabel: {
    color: colors.textFaint,
    fontSize: '0.75rem',
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.wide,
    // Wide, the label shares a line with its links, so it matches the link row
    // height and sits on the first link's baseline. Stacked under it, a 2.5rem
    // line height would spend 40px on a two-word label.
    lineHeight: { default: 1.4, '@media (min-width: 34rem)': '2.5rem' },
    marginBlock: 0,
    textTransform: 'uppercase',
  },

  groupLinks: {
    alignItems: 'baseline',
    display: 'flex',
    flexWrap: 'wrap',
    // 8px if a line ever wraps, 24px between links on the same line. The old
    // 4px/18px had the links nearly touching.
    columnGap: '0.5rem 1.5rem',
    marginBlock: 0,
    minWidth: 0,
  },

  /** 2.5rem (40px) is a comfortable pointer target and well past the 24px
   *  WCAG 2.2 minimum, without the 44px row that made a 14-link list feel
   *  like a ladder. */
  groupLink: {
    alignItems: 'center',
    color: colors.textMuted,
    display: 'inline-flex',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    maxWidth: '100%',
    minHeight: '2.5rem',
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
    gap: '0.5rem 1.5rem',
    justifyContent: { default: 'flex-start', '@media (min-width: 48rem)': 'space-between' },
    marginBlockStart: space['12'],
    paddingBlockStart: space['5'],
  },

  copyright: {
    color: colors.textDim,
    fontSize: '0.8125rem',
    lineHeight: 1.6,
    marginBlock: 0,
  },

  utilityList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0 1.25rem',
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
