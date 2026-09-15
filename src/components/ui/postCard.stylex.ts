import * as stylex from '@stylexjs/stylex'
import { colors, letterSpacing, lineHeights, space } from '../../styles/tokens.stylex'

// Blog list row (PostCard.astro). Hover interactions with the row use the
// `.y-post-card` descendant composites in global.css.
export const postCardStyles = stylex.create({
  row: {
    paddingBlock: space['5'],
  },
  heading: {
    color: colors.text,
    fontSize: '1.2rem',
    fontWeight: 600,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.snug,
    marginBlockEnd: 0,
    marginBlockStart: space['1'],
    transitionDuration: '0.2s',
    transitionProperty: 'transform',
    transitionTimingFunction: 'ease-out',
  },
  titleLink: {
    color: colors.text,
    textDecorationLine: 'none',
    textUnderlineOffset: 3,
    transitionDuration: '0.2s',
    transitionProperty: 'color,text-decoration-color',
  },
  desc: {
    color: colors.textMuted,
    fontSize: '0.95rem',
    lineHeight: lineHeights.relaxed,
    marginBlockEnd: 0,
    marginBlockStart: '0.375rem',
    textWrap: 'pretty',
  },
})