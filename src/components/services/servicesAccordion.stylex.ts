import * as stylex from '@stylexjs/stylex'
import { colors, radii, space, weights } from '../../styles/tokens.stylex'

/* Panel entrance — a small rise+fade, same intent as the old `page-enter`
   used by `.svc-panel`. Killed by the global prefers-reduced-motion guard. */
const panelEnter = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'none' },
})

export const servicesAccordionStyles = stylex.create({
  item: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: '0.9rem',
    borderStyle: 'solid',
    borderWidth: 1,
    transitionDuration: '0.15s',
    transitionProperty: 'border-color,box-shadow',
    ':hover': {
      borderColor: colors.borderStrong,
    },
  },

  itemOpen: {
    borderColor: colors.accentBorder,
    boxShadow: '0 0 0 1px color-mix(in srgb, light-dark(#2563eb, #8bb0ff) 16%, transparent)',
  },

  heading: {
    marginBlock: 0,
  },

  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: space['3'],
  },

  trigger: {
    alignItems: 'center',
    borderRadius: '0.9rem',
    display: 'flex',
    font: 'inherit',
    gap: space['3'],
    padding: space['4'],
    textAlign: 'left',
    width: '100%',
    '@media (min-width: 40rem)': {
      gap: '0.875rem',
      padding: space['5'],
    },
  },

  iconChip: {
    alignItems: 'center',
    backgroundColor: colors.wash,
    borderRadius: radii.md,
    color: colors.textMuted,
    display: 'flex',
    flexShrink: 0,
    height: '2.25rem',
    justifyContent: 'center',
    transitionDuration: '0.15s',
    transitionProperty: 'color',
    width: '2.25rem',
  },

  name: {
    color: colors.text,
    flex: '1 1 0%',
    fontSize: '1.05rem',
    fontWeight: weights.semibold,
    letterSpacing: '-0.01em',
    minWidth: 0,
    transitionDuration: '0.15s',
    transitionProperty: 'color',
  },

  chevron: {
    color: colors.textFaint,
    flexShrink: 0,
    transitionDuration: '0.2s',
    transitionProperty: 'transform,color',
  },

  chevronOpen: {
    color: colors.accent,
    transform: 'rotate(180deg)',
  },

  panel: {
    animationDuration: '0.25s',
    animationFillMode: 'both',
    animationName: panelEnter,
    animationTimingFunction: 'ease-out',
    paddingBlockEnd: '1.25rem',
    paddingBlockStart: '0.1rem',
    paddingInline: '1.1rem',
    '@media (min-width: 40rem)': {
      paddingBlockEnd: space['6'],
      paddingInline: space['5'],
    },
  },

  desc: {
    color: colors.textMuted,
    fontSize: '0.95rem',
    lineHeight: 1.65,
    marginBlockEnd: '1.1rem',
    maxWidth: '44rem',
  },

  includes: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    paddingBlockStart: space['4'],
  },

  label: {
    color: colors.textDim,
    fontSize: '0.75rem',
    fontWeight: weights.semibold,
    letterSpacing: '0.14em',
    marginBlockEnd: '0.55rem',
    textTransform: 'uppercase',
  },

  list: {
    color: colors.textMuted,
    display: 'grid',
    fontSize: '0.9rem',
    gap: '0.4rem 1rem',
    listStyleType: 'none',
    marginBlock: 0,
    paddingInlineStart: 0,
    '@media (min-width: 40rem)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },

  listItem: {
    alignItems: 'flex-start',
    display: 'flex',
    gap: space['2'],
  },

  check: {
    color: colors.accent,
    display: 'inline-flex',
    flexShrink: 0,
    marginBlockStart: '0.28rem',
  },

  footer: {
    alignItems: 'baseline',
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    color: colors.textDim,
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: '0.85rem',
    gap: '0.5rem 1.25rem',
    marginBlockStart: '1.1rem',
    paddingBlockStart: space['4'],
  },

  duration: {
    color: colors.textDim,
  },

  durationStrong: {
    color: colors.text,
    fontWeight: weights.semibold,
  },

  cta: {
    color: colors.accent,
    textDecorationLine: 'none',
    ':hover': {
      textDecorationLine: 'underline',
      textUnderlineOffset: 4,
    },
  },
})
