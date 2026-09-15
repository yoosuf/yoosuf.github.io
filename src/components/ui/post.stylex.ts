import * as stylex from '@stylexjs/stylex'
import { colors, letterSpacing, lineHeights, space, weights } from '../../styles/tokens.stylex'

// Single blog post layout (PostLayout.astro). Body prose remains the `.prose`
// global component class.
export const postStyles = stylex.create({
  title: {
    color: colors.text,
    fontSize: { default: '2rem', '@media (min-width: 40rem)': '2.6rem' },
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.snug,
    marginBlockEnd: 0,
    marginBlockStart: space['2'],
    textWrap: 'balance',
  },

  meta: {
    alignItems: 'center',
    color: colors.textDim,
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: '0.825rem',
    gap: '0.375rem',
    lineHeight: 1.7,
    marginBlockEnd: 0,
    marginBlockStart: space['4'],
  },

  metaItem: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: '0.25rem',
  },

  prose: {
    marginBlockStart: space['10'],
  },

  tags: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    marginBlockStart: space['12'],
    paddingBlockStart: space['6'],
  },

  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.375rem',
    listStyleType: 'none',
    marginBlock: 0,
    paddingInlineStart: 0,
  },
})