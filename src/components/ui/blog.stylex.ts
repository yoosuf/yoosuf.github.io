import * as stylex from '@stylexjs/stylex'
import { colors, lineHeights, radii, space, weights } from '../../styles/tokens.stylex'

// Blog listing chrome (BlogIndex.astro): intro, divided list, pager.
export const blogStyles = stylex.create({
  intro: {
    color: colors.textMuted,
    fontSize: '0.95rem',
    lineHeight: lineHeights.relaxed,
    marginBlockEnd: 0,
    marginBlockStart: space['10'],
    maxWidth: '42rem',
    textWrap: 'pretty',
  },

  summary: {
    color: colors.textDim,
    fontSize: '0.85rem',
    lineHeight: 1.7,
    marginBlockEnd: 0,
    marginBlockStart: space['3'],
  },

  list: {
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    listStyleType: 'none',
    marginBlockEnd: 0,
    marginBlockStart: space['5'],
    paddingInlineStart: 0,
  },

  sentinel: {
    height: 1,
    width: '100%',
  },

  /* Pager / infinite scroll */
  footerNav: {
    alignItems: 'center',
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: space['4'],
    marginBlockStart: { default: space['12'], '@media (min-width: 40rem)': space['16'] },
    paddingBlockStart: space['8'],
  },

  pagerInfo: {
    color: colors.textDim,
    fontSize: '0.85rem',
    lineHeight: 1.7,
    marginBlock: 0,
  },

  pagerList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space['2'],
    justifyContent: 'center',
    listStyleType: 'none',
    marginBlock: 0,
    paddingInlineStart: 0,
  },

  pageLink: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.textMuted,
    display: 'flex',
    fontSize: '0.9rem',
    fontWeight: weights.medium,
    height: '2.25rem',
    justifyContent: 'center',
    minWidth: '2.25rem',
    paddingInline: space['2'],
    textDecorationLine: 'none',
    transitionDuration: '0.15s',
    transitionProperty: 'background-color,border-color,color',
    ':hover': {
      borderColor: colors.borderStrong,
      color: colors.accent,
    },
  },

  pageLinkDisabled: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.textFaint,
    display: 'flex',
    fontSize: '0.9rem',
    height: '2.25rem',
    justifyContent: 'center',
    minWidth: '2.25rem',
    paddingInline: space['2'],
  },

  pageLinkCurrent: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    borderRadius: radii.md,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.onAccent,
    display: 'flex',
    fontSize: '0.9rem',
    fontWeight: weights.semibold,
    height: '2.25rem',
    justifyContent: 'center',
    minWidth: '2.25rem',
    paddingInline: space['2'],
  },

  loadMore: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors.textMuted,
    display: 'inline-flex',
    fontSize: '0.9rem',
    fontWeight: weights.medium,
    height: '2.5rem',
    justifyContent: 'center',
    paddingInline: space['6'],
    transitionDuration: '0.15s',
    transitionProperty: 'background-color,border-color,color',
    ':hover': {
      borderColor: colors.accentBorderHover,
      color: colors.accent,
    },
  },

  noscriptStack: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: space['2'],
  },

  olderLink: {
    color: colors.accent,
    fontSize: '0.9rem',
    textDecorationLine: 'none',
    ':hover': {
      textDecorationLine: 'underline',
    },
  },
})