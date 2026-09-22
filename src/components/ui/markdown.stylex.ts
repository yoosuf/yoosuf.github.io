import * as stylex from '@stylexjs/stylex'
import { colors, fonts, space, weights } from '../../styles/tokens.stylex'

export const markdownStyles = stylex.create({
  paragraph: { color: colors.textMuted, marginBlock: '1.25em', textWrap: 'pretty' },
  heading2: {
    color: colors.text, fontSize: '1.5em', fontWeight: weights.semibold,
    letterSpacing: '-0.02em', lineHeight: 1.3, marginBlockEnd: '0.75em',
    marginBlockStart: '2em', textWrap: 'balance',
  },
  heading3: {
    color: colors.text, fontSize: '1.25em', fontWeight: weights.semibold,
    letterSpacing: '-0.02em', lineHeight: 1.3, marginBlockEnd: '0.75em',
    marginBlockStart: '1.6em', textWrap: 'balance',
  },
  heading4: {
    color: colors.text, fontSize: '1.1em', fontWeight: weights.semibold,
    letterSpacing: '-0.02em', lineHeight: 1.3, marginBlockEnd: '0.75em',
    marginBlockStart: '1.5em', textWrap: 'balance',
  },
  list: { color: colors.textMuted, listStyleType: 'disc', marginBlock: '1.25em', paddingInlineStart: '1.5em' },
  orderedList: { color: colors.textMuted, listStyleType: 'decimal', marginBlock: '1.25em', paddingInlineStart: '1.5em' },
  listItem: { marginBlock: '0.5em' },
  link: {
    color: colors.accent, fontWeight: weights.medium, textDecorationLine: 'underline',
    textDecorationThickness: 1, textUnderlineOffset: 3, transitionDuration: '0.15s',
    transitionProperty: 'color',
    ':hover': { color: colors.accentStrong, textDecorationThickness: 2 },
  },
  quote: {
    borderInlineStartColor: colors.border, borderInlineStartStyle: 'solid', borderInlineStartWidth: 2,
    color: colors.textMuted, marginBlock: '1.25em', paddingInlineStart: space['6'],
  },
  code: {
    backgroundColor: colors.wash, borderColor: colors.border, borderRadius: 4,
    borderStyle: 'solid', borderWidth: 1, color: colors.text, fontFamily: fonts.mono,
    fontSize: '0.88em', paddingBlock: '0.1em', paddingInline: '0.35em',
  },
  pre: {
    borderColor: colors.border, borderRadius: 8, borderStyle: 'solid', borderWidth: 1,
    marginBlock: '1.25em', maxWidth: '100%', overflowX: 'auto', paddingBlock: '1em', paddingInline: '1.25em',
  },
  rule: { borderBlockStartColor: colors.border, borderBlockStartStyle: 'solid', borderBlockStartWidth: 1, marginBlock: '2em' },
  image: { borderRadius: '0.5rem', display: 'block', height: 'auto', marginBlock: '2em', maxWidth: '100%' },
  video: { borderRadius: '0.5rem', display: 'block', height: 'auto', marginBlock: '2em', maxWidth: '100%' },
  table: { display: 'block', fontSize: '0.95em', marginBlock: '1.25em', maxWidth: '100%', overflowX: 'auto', width: '100%' },
  tableHead: {}, tableBody: {}, tableRow: {},
  tableCell: {
    borderColor: colors.border, borderStyle: 'solid', borderWidth: 1, paddingBlock: space['2'],
    paddingInline: space['3'], textAlign: 'left', verticalAlign: 'baseline',
  },
  tableHeader: {
    backgroundColor: colors.wash, borderColor: colors.border, borderStyle: 'solid', borderWidth: 1,
    fontWeight: weights.semibold, paddingBlock: space['2'], paddingInline: space['3'],
    textAlign: 'left', verticalAlign: 'baseline',
  },
  figure: { marginBlock: '1.25em' },
  caption: { color: colors.textDim, fontSize: '0.85em', marginBlockStart: space['2'], textAlign: 'center' },
  strong: { color: colors.text, fontWeight: weights.semibold },
  kbd: { fontFamily: fonts.mono },
})
