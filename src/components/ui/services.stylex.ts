import * as stylex from '@stylexjs/stylex'
import { colors, fonts, lineHeights, space, weights } from '../../styles/tokens.stylex'

// Services page (EngagementPricing.astro). FAQ elements are styled directly
// through these keys; no global element relationship selectors are required.
export const servicesStyles = stylex.create({
  content: {
    marginBlockStart: space['10'],
  },

  intro: {
    color: colors.textMuted,
    fontSize: '0.975rem',
    lineHeight: lineHeights.relaxed,
    marginBlockEnd: space['8'],
    maxWidth: '44rem',
    textWrap: 'pretty',
  },

  section: {
    marginBlockStart: { default: space['12'], '@media (min-width: 40rem)': space['16'] },
  },

  processList: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    listStyleType: 'none',
    marginBlockEnd: 0,
    marginBlockStart: space['5'],
    paddingInlineStart: 0,
  },

  processItem: {
    alignItems: 'baseline',
    display: 'flex',
    gap: space['5'],
    paddingBlock: space['4'],
  },

  processNum: {
    color: colors.textFaint,
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: '0.8rem',
    width: '1.75rem',
  },

  processName: {
    color: colors.text,
    fontWeight: weights.semibold,
    marginBlock: 0,
  },

  processDesc: {
    color: colors.textMuted,
    fontSize: '0.9rem',
    lineHeight: lineHeights.relaxed,
    marginBlockEnd: 0,
    marginBlockStart: '0.125rem',
    maxWidth: '42rem',
    textWrap: 'pretty',
  },

  faqList: {
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    marginBlockStart: space['5'],
  },

  faqItem: {
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
  },

  summary: {
    alignItems: 'baseline',
    cursor: 'pointer',
    display: 'flex',
    gap: space['4'],
    justifyContent: 'space-between',
    listStyleType: 'none',
    paddingBlock: space['4'],
  },

  summaryText: {
    color: colors.text,
    fontSize: '1rem',
    fontWeight: weights.semibold,
  },

  chevron: {
    color: colors.textDim,
    flexShrink: 0,
    transitionDuration: '0.2s',
    transitionProperty: 'transform,color',
  },

  faqBody: {
    paddingBlockEnd: space['5'],
    paddingInline: '0.25rem',
  },

  faqAnswer: {
    color: colors.textMuted,
    fontSize: '0.925rem',
    lineHeight: lineHeights.relaxed,
    marginBlock: 0,
    maxWidth: '44rem',
    textWrap: 'pretty',
  },

})
