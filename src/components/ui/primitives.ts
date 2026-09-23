import * as stylex from '@stylexjs/stylex'
import { colors, letterSpacing, lineHeights, radii, space, typeScale, weights } from '../../styles/tokens.stylex'

// Shared semantic primitives — the building blocks pages compose. Tokens only;
// no brand-specific values, so themes stay the single source of truth.

export const a11y = stylex.create({
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
    border: 0,
  },
})

// Uppercase kicker labels (eyebrows / mini headings).
export const kicker = stylex.create({
  eyebrow: {
    color: colors.textDim,
    fontSize: '0.75rem',
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.wide,
    lineHeight: 1.5,
    textTransform: 'uppercase',
  },
  date: {
    color: colors.textFaint,
    fontSize: '0.775rem',
    fontWeight: weights.medium,
    letterSpacing: '0.12em',
    lineHeight: 1.5,
    textTransform: 'uppercase',
  },
})

// Headline hierarchy.
export const headings = stylex.create({
  page: {
    color: colors.text,
    fontSize: { default: typeScale['2xl'], '@media (min-width: 40rem)': typeScale['3xl'] },
    fontWeight: weights.semibold,
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeights.snug,
    marginBlock: 0,
    textWrap: 'balance',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typeScale['2xl'],
    fontWeight: weights.semibold,
    letterSpacing: '-0.02em',
    lineHeight: lineHeights.snug,
    marginBlock: 0,
    textWrap: 'balance',
  },
  card: {
    color: colors.text,
    fontSize: typeScale.xl,
    fontWeight: weights.semibold,
    letterSpacing: '-0.01em',
    lineHeight: lineHeights.snug,
    marginBlock: 0,
  },
})

// Body copy helpers.
export const body = stylex.create({
  muted: {
    color: colors.textMuted,
    fontSize: '0.95rem',
    lineHeight: 1.7,
    textWrap: 'pretty',
  },
  dim: {
    color: colors.textDim,
    fontSize: '0.85rem',
    lineHeight: 1.7,
    textWrap: 'pretty',
  },
  dimSmall: {
    color: colors.textDim,
    fontSize: '0.8rem',
    lineHeight: 1.7,
  },
  faintSmall: {
    color: colors.textFaint,
    fontSize: '0.85rem',
    lineHeight: 1.7,
  },
})

export const buttons = stylex.create({
  primary: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    color: colors.onAccent,
    display: 'inline-flex',
    fontSize: '0.95rem',
    fontWeight: weights.semibold,
    gap: space['2'],
    paddingBlock: '0.625rem',
    paddingInline: space['5'],
    textDecorationLine: 'none',
    textWrap: 'nowrap',
    transitionProperty: 'background-color',
    transitionDuration: '0.15s',
    ':hover': {
      backgroundColor: colors.accentStrong,
    },
  },
  secondary: {
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radii.lg,
    color: colors.text,
    display: 'inline-flex',
    fontSize: '0.95rem',
    fontWeight: weights.semibold,
    gap: space['2'],
    paddingBlock: '0.625rem',
    paddingInline: space['5'],
    textDecorationLine: 'none',
    textWrap: 'nowrap',
    transitionProperty: 'background-color,border-color,color',
    transitionDuration: '0.15s',
    ':hover': {
      borderColor: colors.borderStrong,
      color: colors.accent,
    },
  },
  textLink: {
    color: colors.accent,
    fontSize: '0.95rem',
    textDecorationLine: 'none',
    textUnderlineOffset: 4,
    transitionProperty: 'color',
    transitionDuration: '0.15s',
    ':hover': {
      color: colors.accentStrong,
      textDecorationLine: 'underline',
      textDecorationThickness: 1,
      textUnderlineOffset: 4,
    },
  },
  small: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: '0.25rem',
    color: colors.onAccent,
    display: 'inline-flex',
    fontSize: '0.9rem',
    fontWeight: weights.semibold,
    gap: space['2'],
    paddingBlock: space['2'],
    paddingInline: space['4'],
    textDecorationLine: 'none',
    textWrap: 'nowrap',
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    ':hover': {
      opacity: 0.9,
    },
  },
})

// Pill badges (status / category chips).
export const pills = stylex.create({
  accent: {
    backgroundColor: colors.accentSoftBg,
    borderRadius: '999px',
    color: colors.accent,
    fontSize: '0.7rem',
    fontWeight: weights.semibold,
    letterSpacing: '0.1em',
    lineHeight: 1.4,
    paddingBlock: '0.125rem',
    paddingInline: '0.625rem',
    textTransform: 'uppercase',
  },
  accentBorder: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.accentBorder,
    borderRadius: '999px',
    color: colors.accent,
    fontSize: '0.7rem',
    fontWeight: weights.semibold,
    letterSpacing: '0.1em',
    lineHeight: 1.4,
    paddingBlock: '0.125rem',
    paddingInline: '0.625rem',
    textTransform: 'uppercase',
  },
  neutral: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '999px',
    color: colors.textDim,
    fontSize: '0.7rem',
    fontWeight: weights.medium,
    lineHeight: 1.4,
    paddingBlock: '0.125rem',
    paddingInline: '0.625rem',
    textTransform: 'uppercase',
  },
  tag: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '0.25rem',
    color: colors.textDim,
    fontSize: '0.725rem',
    lineHeight: 1.4,
    paddingBlock: '0.125rem',
    paddingInline: space['2'],
  },
})

// Horizontal rules inside divided lists.
export const dividers = stylex.create({
  topBottom: {
    borderBlockStartWidth: 1,
    borderBlockEndWidth: 1,
    borderBlockStartStyle: 'solid',
    borderBlockEndStyle: 'solid',
    borderBlockStartColor: colors.border,
    borderBlockEndColor: colors.border,
  },
  top: {
    borderBlockStartWidth: 1,
    borderBlockStartStyle: 'solid',
    borderBlockStartColor: colors.border,
  },
})