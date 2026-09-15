import * as stylex from '@stylexjs/stylex'
import { space } from '../../styles/tokens.stylex'

export const servicesAccordionStyles = stylex.create({
  heading: {
    marginBlock: 0,
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: space['3'],
  },
})
