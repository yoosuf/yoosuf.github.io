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
    maxWidth: '46rem',
  },

  tags: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    marginBlockStart: { default: space['12'], '@media (min-width: 40rem)': space['16'] },
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

  pager: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'grid',
    gap: '0.75rem',
    gridTemplateColumns: { default: '1fr', '@media (min-width: 40rem)': '1fr 1fr' },
    marginBlockStart: space['6'],
    paddingBlockStart: space['6'],
  },

  pagerLink: {
    borderRadius: '0.5rem',
    color: colors.text,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    paddingBlock: '0.75rem',
    paddingInline: '0.875rem',
    textDecorationLine: 'none',
    transitionDuration: '0.15s',
    transitionProperty: 'background-color',
    ':hover': {
      backgroundColor: colors.wash,
    },
  },

  pagerLinkNewer: {
    alignItems: 'flex-end',
    textAlign: 'right',
  },

  pagerLabel: {
    color: colors.textFaint,
    fontSize: '0.7rem',
    fontWeight: weights.semibold,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },

  pagerTitle: {
    color: colors.text,
    fontSize: '1rem',
    fontWeight: weights.medium,
    lineHeight: 1.4,
    textWrap: 'balance',
  },
})