import * as stylex from '@stylexjs/stylex'
import { colors, fonts, radii, space, weights } from '../../styles/tokens.stylex'
import { diagramTokens } from '../../styles/diagramTokens.stylex'

export const mermaidDiagramStyles = stylex.create({
  root: {
    display: 'block',
    marginBlock: space['8'],
    maxWidth: '100%',
    width: '100%',
  },
  header: {
    marginBlockEnd: space['3'],
  },
  title: {
    color: colors.text,
    fontFamily: fonts.sans,
    fontSize: '1rem',
    fontWeight: weights.semibold,
    letterSpacing: '-0.01em',
    lineHeight: 1.35,
  },
  surface: {
    borderColor: diagramTokens.pencilBorder,
    borderRadius: radii.lg,
    borderStyle: 'solid',
    borderWidth: 1,
    maxWidth: '100%',
    overflowX: 'auto',
    paddingBlock: space['4'],
    paddingInline: {
      default: space['4'],
      '@media (min-width: 48rem)': space['6'],
    },
    position: 'relative',
    scrollbarColor: `${diagramTokens.pencilBorder} transparent`,
    width: '100%',
  },
  pencil: {
    backgroundColor: diagramTokens.pencilSurface,
    backgroundImage: `linear-gradient(${diagramTokens.pencilGrid} 1px, transparent 1px), linear-gradient(90deg, ${diagramTokens.pencilGrid} 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
    borderColor: diagramTokens.pencilBorder,
    color: diagramTokens.pencilInk,
  },
  marker: {
    backgroundColor: diagramTokens.markerSurface,
    borderColor: diagramTokens.markerBorder,
    color: diagramTokens.markerInk,
  },
  defaultSize: {
    minHeight: '10rem',
  },
  wide: {
    minWidth: '42rem',
  },
  target: {
    display: 'flex',
    justifyContent: 'center',
    color: diagramTokens.pencilInk,
    minWidth: 0,
    opacity: 1,
    transitionDuration: '0.15s',
    transitionProperty: 'opacity',
    width: '100%',
    ':global(svg)': {
      display: 'block',
      height: 'auto',
      marginInline: 'auto',
      maxWidth: 'none',
      minWidth: '100%',
      width: 'max-content',
    },
  },
  pending: {
    opacity: 0,
  },
  ready: {
    opacity: 1,
  },
  error: {
    color: diagramTokens.error,
    fontFamily: fonts.mono,
    fontSize: '0.8125rem',
    lineHeight: 1.5,
    opacity: 1,
    paddingBlock: space['4'],
  },
  caption: {
    color: colors.textDim,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    marginBlockStart: space['3'],
  },
})
