import * as stylex from '@stylexjs/stylex'
import { colors, letterSpacing, lineHeights, space, typeScale, weights } from '../../styles/tokens.stylex'

// Flat markdown page chrome (the old `site-container py-14 sm:py-20` + header
// + h1 in PageLayout.astro). Prose/typography of the rendered body stays on
// global CSS until the Prose milestone.
export const pageStyles = stylex.create({
  // Canonical content width (replaces the removed `.site-container`): full
  // width, capped at 68rem, auto-centred, with responsive inline padding.
  // Compose this onto any full-bleed page/article shell.
  container: {
    marginInlineEnd: 'auto',
    marginInlineStart: 'auto',
    maxWidth: '68rem',
    paddingInlineEnd: { default: '1.25rem', '@media (min-width: 40rem)': '2rem' },
    paddingInlineStart: { default: '1.25rem', '@media (min-width: 40rem)': '2rem' },
    width: '100%',
  },
  page: {
    paddingBlockStart: { default: space['14'], '@media (min-width: 40rem)': space['20'] },
    paddingBlockEnd: { default: space['14'], '@media (min-width: 40rem)': space['20'] },
  },
  header: {
    marginBlockStart: space['8'],
  },
  title: {
    marginBlock: 0,
    fontSize: { default: typeScale['2xl'], '@media (min-width: 40rem)': typeScale['3xl'] },
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.snug,
    color: colors.text,
    textWrap: 'balance',
  },
})