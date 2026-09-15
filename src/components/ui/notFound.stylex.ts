import * as stylex from '@stylexjs/stylex'
import { colors, lineHeights, space } from '../../styles/tokens.stylex'

export const notFoundStyles = stylex.create({
  article: {
    paddingBlock: { default: space['20'], '@media (min-width: 40rem)': '7rem' },
  },
  title: {
    color: colors.text,
    fontSize: '2.25rem',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.3,
    marginBlock: 0,
  },
  lead: {
    color: colors.textMuted,
    fontSize: '0.975rem',
    lineHeight: lineHeights.relaxed,
    marginBlockEnd: 0,
    marginBlockStart: space['4'],
    maxWidth: '28rem',
    textWrap: 'pretty',
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: '0.9rem',
    gap: '0.5rem 1.25rem',
    marginBlockStart: space['8'],
  },
})
