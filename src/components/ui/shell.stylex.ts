import * as stylex from '@stylexjs/stylex'
import { colors, fonts, space } from '../../styles/tokens.stylex'

// HTML shell chrome in BaseLayout.astro (document, body flex column + main grow)
// and the PageLayout prose spacer.
export const shellStyles = stylex.create({
  html: {
    backgroundColor: colors.bg,
    colorScheme: 'light dark',
    fontFamily: fonts.sans,
    lineHeight: 1.5,
    textSizeAdjust: '100%',
  },
  skipLink: {
    backgroundColor: colors.accent,
    color: colors.onAccent,
    fontSize: '0.875rem',
    fontWeight: 600,
    left: space['2'],
    paddingBlock: space['2'],
    paddingInline: space['4'],
    position: 'fixed',
    textDecorationLine: 'none',
    top: space['2'],
    transform: 'translateY(-24rem)',
    transitionDuration: '0.15s',
    transitionProperty: 'transform',
    zIndex: 10000,
    ':focus': {
      transform: 'translateY(0)',
    },
  },

  body: {
    backgroundColor: colors.bg,
    color: colors.text,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: fonts.sans,
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.7,
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },

  main: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%', // flex-1
  },

  prose: {
    marginBlockStart: space['10'],
    maxWidth: '46rem',
  },
})
