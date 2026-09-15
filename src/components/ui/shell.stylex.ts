import * as stylex from '@stylexjs/stylex'
import { colors } from '../../styles/tokens.stylex'
import { space } from '../../styles/tokens.stylex'

// HTML shell chrome in BaseLayout.astro (body flex column + main grow) and the
// PageLayout prose spacer. `.page-enter` remains a global entrance animation class.
export const shellStyles = stylex.create({
  body: {
    backgroundColor: colors.bg,
    color: colors.text,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },

  main: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%', // flex-1
  },

  prose: {
    marginBlockStart: space['10'],
  },
})