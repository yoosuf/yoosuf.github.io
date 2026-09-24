import * as stylex from '@stylexjs/stylex'
import { colors, letterSpacing, lineHeights, radii, space, typeScale, weights } from '../../styles/tokens.stylex'

// Homepage hero + sections. Every element receives its own StyleX attrs.
export const homeStyles = stylex.create({
  article: {
    paddingBlockEnd: { default: space['12'], '@media (min-width: 40rem)': space['20'] },
    paddingBlockStart: { default: space['12'], '@media (min-width: 40rem)': space['20'] },
  },

  /* Hero */
  hero: {
    position: 'relative',
  },

  availPill: {
    alignItems: 'center',
    backgroundColor: colors.washSoft,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '999px',
    color: colors.textMuted,
    display: 'inline-flex',
    fontSize: '0.8rem',
    fontWeight: weights.medium,
    gap: space['2'],
    paddingBlock: '0.25rem',
    paddingInline: '0.75rem',
    position: 'relative',
  },

  pulseDotWrap: {
    height: '0.5rem',
    position: 'relative',
    width: '0.5rem',
  },

  pulseDot: {
    backgroundColor: colors.accent,
    borderRadius: '999px',
    display: 'inline-flex',
    height: '0.5rem',
    position: 'absolute',
    inset: 0,
    width: '0.5rem',
  },

  pulseDotPing: {
    backgroundColor: colors.accent,
    borderRadius: '999px',
    display: 'inline-flex',
    height: '100%',
    opacity: 0.6,
    position: 'absolute',
    inset: 0,
    transformOrigin: 'center',
    width: '100%',
  },

  headline: {
    color: colors.text,
    fontSize: { default: '2.2rem', '@media (min-width: 40rem)': '3rem', '@media (min-width: 64rem)': '3.4rem' },
    fontWeight: weights.semibold,
    letterSpacing: '-0.03em',
    lineHeight: 1.08,
    marginBlockEnd: 0,
    marginBlockStart: space['5'],
    maxWidth: '16ch',
    textWrap: 'balance',
    position: 'relative',
  },

  headlineStrong: {
    display: 'inline-block',
    position: 'relative',
    whiteSpace: 'nowrap',
  },

  headlineStrongText: {
    position: 'relative',
    zIndex: 1,
  },

  underlineSquiggle: {
    bottom: '-0.25rem',
    color: colors.accent,
    height: '0.625rem',
    left: 0,
    position: 'absolute',
    width: '100%',
    '@media (min-width: 40rem)': {
      bottom: '-0.5rem',
    },
  },

  lead: {
    color: colors.textMuted,
    fontSize: '1.05rem',
    lineHeight: lineHeights.relaxed,
    marginBlockEnd: 0,
    marginBlockStart: space['6'],
    maxWidth: '46rem',
    position: 'relative',
    textWrap: 'pretty',
  },

  heroActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem 1.5rem',
    marginBlockStart: space['8'],
    position: 'relative',
  },

  /* Section rhythm + headers */
  section: {
    marginBlockStart: { default: space['12'], '@media (min-width: 40rem)': space['16'] },
  },

  sectionHeader: {
    alignItems: 'flex-end',
    display: 'flex',
    gap: space['4'],
    justifyContent: 'space-between',
  },

  sectionLink: {
    color: colors.accent,
    fontSize: '0.85rem',
    textDecorationLine: 'none',
    textUnderlineOffset: 4,
    transitionDuration: '0.15s',
    transitionProperty: 'color',
    ':hover': {
      color: colors.accentStrong,
      textDecorationLine: 'underline',
      textDecorationThickness: 1,
      textUnderlineOffset: 4,
    },
  },

  /* Products grid */
  productGrid: {
    display: 'grid',
    gap: space['4'],
    listStyleType: 'none',
    marginBlockEnd: 0,
    marginBlockStart: space['5'],
    paddingInlineStart: 0,
    '@media (min-width: 40rem)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (min-width: 64rem)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },

  productCard: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: space['5'],
    textDecorationLine: 'none',
    transitionDuration: '0.2s,0.15s,0.2s',
    transitionProperty: 'transform,border-color,box-shadow',
    ':hover': {
      borderColor: colors.accentBorderHover,
      boxShadow: '0 16px 36px -20px color-mix(in srgb, #2563eb 45%, transparent)',
      transform: 'translateY(-3px)',
    },
  },

  productCardStatic: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: space['5'],
    transitionDuration: '0.15s',
    transitionProperty: 'background-color,border-color,color',
    ':hover': {
      borderColor: colors.borderSubtle,
    },
  },

  productIconRow: {
    alignItems: 'center',
    display: 'flex',
    gap: space['3'],
  },

  productIcon: {
    alignItems: 'center',
    backgroundColor: colors.wash,
    borderRadius: radii.md,
    color: colors.textMuted,
    display: 'flex',
    flexShrink: 0,
    height: '2.25rem',
    justifyContent: 'center',
    width: '2.25rem',
  },

  productTitleRow: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    gap: space['3'],
    justifyContent: 'space-between',
  },

  productTitle: {
    color: colors.text,
    fontSize: '1.05rem',
    fontWeight: weights.semibold,
    letterSpacing: '-0.01em',
    lineHeight: lineHeights.snug,
    transitionDuration: '0.15s',
    transitionProperty: 'color',
  },

  productDesc: {
    color: colors.textMuted,
    fontSize: '0.925rem',
    lineHeight: lineHeights.relaxed,
    marginBlockEnd: 0,
    marginBlockStart: '0.75rem',
    textWrap: 'pretty',
  },

  productCta: {
    alignItems: 'center',
    color: colors.accent,
    display: 'flex',
    fontSize: '0.85rem',
    fontWeight: weights.medium,
    gap: '0.375rem',
    marginBlockStart: 'auto',
    paddingBlockStart: space['4'],
  },

  productCtaStatic: {
    color: colors.textFaint,
    fontSize: '0.85rem',
    fontWeight: weights.medium,
    gap: '0.375rem',
    marginBlockStart: 'auto',
    paddingBlockStart: space['4'],
  },

  productArrow: {
    transitionDuration: '0.2s',
    transitionProperty: 'transform',
  },

  postList: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    listStyleType: 'none',
    marginBlock: 0,
    paddingInlineStart: 0,
  },

  postListFull: {
    borderBlockStartColor: colors.border,
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockStartStyle: 'solid',
    borderBlockEndWidth: 1,
    borderBlockStartWidth: 1,
    listStyleType: 'none',
    marginBlockEnd: 0,
    marginBlockStart: space['5'],
    paddingInlineStart: 0,
  },

  /* CTA band */
  ctaBand: {
    backgroundColor: colors.wash,
    borderColor: colors.border,
    borderRadius: '1.25rem',
    borderStyle: 'solid',
    borderWidth: 1,
    marginBlockEnd: { default: space['10'], '@media (min-width: 40rem)': space['14'] },
    marginBlockStart: 0,
    paddingBlock: { default: space['14'], '@media (min-width: 40rem)': space['20'] },
    paddingInline: { default: space['6'], '@media (min-width: 40rem)': space['12'] },
    position: 'relative',
    textAlign: 'center',
  },

  ctaHeading: {
    color: colors.text,
    fontSize: { default: '1.6rem', '@media (min-width: 40rem)': typeScale['2xl'] },
    fontWeight: weights.semibold,
    letterSpacing: '-0.02em',
    lineHeight: lineHeights.snug,
    marginBlock: 0,
    textWrap: 'balance',
  },

  ctaBody: {
    color: colors.textMuted,
    fontSize: '1rem',
    lineHeight: lineHeights.relaxed,
    marginBlockEnd: 0,
    marginBlockStart: '0.75rem',
    marginInlineEnd: 'auto',
    marginInlineStart: 'auto',
    maxWidth: '36rem',
    textWrap: 'pretty',
  },

  ctaActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem 1.5rem',
    justifyContent: 'center',
    marginBlockStart: space['8'],
  },
})
