import * as stylex from '@stylexjs/stylex'

/**
 * Product marketing microsite — StyleX layer.
 *
 * Theme model: the `--pm-*` custom properties are a per-page theme applied as
 * an inline style on `.pm-page` (see ProductLayout.astro). Products supply
 * accent primitives (`--pm-*-light`) and the layout derives the light-dark()
 * pairs, so the values below reference tokens as `var(--pm-*)` strings and are
 * therefore theme-aware without a stylesheet.
 *
 * What stays in global.css (unlayered, scoped `.pm-page`): descendant /
 * JS-created-element / runtime-state / animated-pseudo rules StyleX can't
 * express — `.pm-page code` pill + resets, `.pm-builtfor-icon svg` sizes,
 * `.pm-flow-log-line` (JS-created), `.pm-status-polling` LED, flow rail
 * `::before` dash tracks + keyframes, `.pm-faq-item` internals, `.pm-tool`
 * hover children, tab selected state, `/dashboard` axis var, CTA ghost on the
 * dark hero/CTA bands.
 */

const dashCore = stylex.keyframes({
  to: { backgroundPosition: '16px calc(100% - 1px)' },
})

const glow = stylex.keyframes({
  '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
  '50%': { boxShadow: '0 0 0 6px rgba(16, 185, 129, 0.22)' },
})

export const styles = stylex.create({
  /* Page shell — hard guarantee against horizontal page scroll from the
     animated flow diagram and wide code blocks (tables scroll internally). */
  pmPage: {
    overflowX: 'clip',
  },

  /* Shared container: matches the site's canonical 68rem width so the
     microsite aligns with the global header/footer. */
  pmContainer: {
    maxWidth: '68rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '1.25rem',
    paddingRight: '1.25rem',
    '@media (min-width: 640px)': {
      paddingLeft: '2rem',
      paddingRight: '2rem',
    },
    /* Original product.css kept 20px gutters through 767px despite the 2rem
       step at 640px; preserve that quirk. */
    '@media (max-width: 767px)': {
      paddingLeft: '1.25rem',
      paddingRight: '1.25rem',
    },
  },

  /* --- Hero split (copy + terminal) --- */
  pmHero: {
    paddingTop: '84px',
    paddingBottom: '92px',
    backgroundImage:
      'radial-gradient(1100px 460px at 78% -10%, color-mix(in srgb, var(--pm-accent) 17%, transparent), transparent 62%), linear-gradient(180deg, #0d1522 0%, var(--pm-term-bg) 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
    '@media (max-width: 979px)': {
      paddingTop: '64px',
      paddingBottom: '68px',
    },
    '@media (max-width: 767px)': {
      paddingTop: '44px',
      paddingBottom: '48px',
    },
  },

  pmHeroGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    alignItems: 'center',
    gap: '44px',
    maxWidth: '68rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '1.25rem',
    paddingRight: '1.25rem',
    '@media (min-width: 640px)': {
      paddingLeft: '2rem',
      paddingRight: '2rem',
    },
    '@media (min-width: 980px)': {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.05fr)',
      gap: '64px',
    },
    '@media (max-width: 979px)': {
      gap: '36px',
    },
  },

  pmHeroLeft: {
    minWidth: 0,
    '@media (min-width: 980px)': {
      paddingTop: '8px',
      paddingBottom: '8px',
    },
  },

  pmHeroTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    paddingTop: '4px',
    paddingRight: '14px',
    paddingBottom: '4px',
    paddingLeft: '14px',
    marginBottom: '20px',
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--pm-term-accent)',
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 15%, transparent)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 28%, transparent)',
    borderRadius: 999,
  },

  pmHeroTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '16px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-hero)',
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.035em',
    color: '#f8fafc',
    '@media (max-width: 767px)': {
      fontSize: 'clamp(1.9rem, 5.5vw, 2.3rem)',
    },
  },

  pmHeroSub: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '24px',
    marginLeft: 0,
    maxWidth: '560px',
    fontSize: 'var(--pm-fs-lead)',
    lineHeight: 1.6,
    color: '#94a3b8',
    '@media (min-width: 980px)': {
      maxWidth: '520px',
    },
    '@media (max-width: 767px)': {
      fontSize: 'var(--pm-fs-title)',
    },
  },

  pmHeroActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    '@media (max-width: 767px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },

  pmHeroChecks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px 22px',
    marginTop: '22px',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    padding: 0,
    listStyle: 'none',
    '@media (max-width: 767px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '6px',
    },
  },

  pmHeroRight: {
    minWidth: 0,
  },

  /* --- Terminal mockup --- */
  pmTerminal: {
    backgroundColor: 'var(--pm-term-bg)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(52, 211, 153, 0.25)',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 24px 60px -24px var(--pm-accent-glow), 0 0 1px rgba(0, 0, 0, 0.4)',
    fontFamily: 'var(--font-mono)',
  },

  pmTerminalBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '12px',
    paddingRight: '16px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
    backgroundColor: 'color-mix(in srgb, #fff 4%, transparent)',
  },

  pmTerminalDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
  },
  pmTerminalDotRed: {
    backgroundColor: '#f87171',
  },
  pmTerminalDotYellow: {
    backgroundColor: '#fbbf24',
  },
  pmTerminalDotGreen: {
    backgroundColor: '#34d399',
  },

  pmTerminalTitle: {
    marginLeft: '10px',
    fontSize: 'var(--pm-fs-xs)',
    color: 'var(--pm-term-text)',
    opacity: 0.75,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  pmTerminalBody: {
    paddingTop: '18px',
    paddingRight: '20px',
    paddingBottom: '20px',
    paddingLeft: '20px',
    '@media (max-width: 767px)': {
      paddingTop: '14px',
      paddingRight: '16px',
      paddingBottom: '14px',
      paddingLeft: '16px',
    },
  },

  pmTerminalLines: {
    margin: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-xs)',
    lineHeight: 1.8,
    color: 'var(--pm-term-text)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    tabSize: 4,
  },

  pmPrompt: {
    fontWeight: 700,
    color: 'var(--pm-term-accent)',
  },
  pmOk: {
    fontWeight: 700,
    color: 'var(--pm-term-accent)',
  },

  /* --- Subnav --- */
  pmSubnav: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backgroundColor: 'var(--pm-nav-bg)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--pm-border)',
  },

  pmSubnavContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  pmBrand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '9px',
    paddingTop: '13px',
    paddingRight: '16px',
    paddingBottom: '13px',
    paddingLeft: 0,
    fontSize: 'var(--pm-fs-small)',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    color: 'var(--pm-accent-strong)',
    textDecoration: 'none',
  },

  pmSubnavLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: 'auto',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  pmSubnavLink: {
    paddingTop: '13px',
    paddingRight: '14px',
    paddingBottom: '13px',
    paddingLeft: '14px',
    fontSize: 'var(--pm-fs-xs)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    color: 'var(--pm-ink-faint)',
    textDecoration: 'none',
    ':hover': {
      color: 'var(--pm-accent-strong)',
    },
  },

  /* --- "Built for" strip --- */
  pmBuiltfor: {
    paddingTop: '32px',
    paddingBottom: '38px',
    backgroundColor: 'var(--pm-surface)',
    borderBottom: '1px solid var(--pm-border)',
    '@media (max-width: 767px)': {
      paddingTop: '26px',
      paddingBottom: '32px',
    },
  },

  pmBuiltforLabel: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '18px',
    marginLeft: 0,
    textAlign: 'center',
    fontSize: 'var(--pm-fs-xs)',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--pm-ink-faint)',
  },

  pmBuiltforIcons: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '14px',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    '@media (max-width: 767px)': {
      gap: '10px',
    },
  },

  pmBuiltforIcon: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    height: 54,
    /* Brand logotype chips stay light in dark mode — the marks are drawn to be
       read on white; forcing them dark erases black glyphs. */
    color: 'light-dark(var(--pm-ink), #0b1220)',
    backgroundColor: 'light-dark(var(--pm-bg-soft), var(--pm-logo-chip))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 15,
    boxShadow: 'var(--pm-shadow-card)',
    transitionProperty: 'border-color, box-shadow, transform, background-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    ':hover': {
      backgroundColor: 'light-dark(#ffffff, var(--pm-logo-chip))',
      borderColor: 'color-mix(in srgb, var(--pm-accent) 48%, var(--pm-border))',
      boxShadow: '0 10px 22px -10px var(--pm-accent-glow)',
      transform: 'translateY(-2px)',
    },
    ':focus-visible': {
      backgroundColor: 'light-dark(#ffffff, var(--pm-logo-chip))',
      borderColor: 'color-mix(in srgb, var(--pm-accent) 48%, var(--pm-border))',
      boxShadow: '0 10px 22px -10px var(--pm-accent-glow)',
      transform: 'translateY(-2px)',
    },
    ':after': {
      content: 'attr(title)',
      position: 'absolute',
      bottom: 'calc(100% + 9px)',
      left: '50%',
      transform: 'translateX(-50%) translateY(3px)',
      paddingTop: '4px',
      paddingRight: '9px',
      paddingBottom: '4px',
      paddingLeft: '9px',
      borderRadius: 6,
      backgroundColor: 'var(--pm-band)',
      color: '#fff',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.02em',
      lineHeight: 1.3,
      whiteSpace: 'nowrap',
      opacity: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
      zIndex: 20,
      transitionProperty: 'opacity, transform, visibility',
      transitionDuration: '0.15s',
    },
    ':before': {
      content: '""',
      position: 'absolute',
      bottom: 'calc(100% + 5px)',
      left: '50%',
      width: 7,
      height: 7,
      backgroundColor: 'var(--pm-band)',
      transform: 'translateX(-50%) rotate(45deg)',
      opacity: 0,
      visibility: 'hidden',
      pointerEvents: 'none',
      zIndex: 20,
      transitionProperty: 'opacity, visibility',
      transitionDuration: '0.15s',
    },
    ':hover:after': {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateX(-50%) translateY(0)',
    },
    ':hover:before': {
      opacity: 1,
      visibility: 'visible',
    },
    ':focus-visible:after': {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateX(-50%) translateY(0)',
    },
    ':focus-visible:before': {
      opacity: 1,
      visibility: 'visible',
    },
    '@media (max-width: 767px)': {
      width: 48,
      height: 48,
      borderRadius: 13,
    },
  },

  /* Official brand marks — fill = brand color (kept on hover). */
  pmIcClaude: { color: '#d97757' },
  pmIcCursor: { color: '#000000' },
  pmIcWindsurf: { color: '#0d1b2a' },
  pmIcCopilot: { color: '#6e40c9' },
  pmIcOpenai: { color: '#10a37f' },
  pmIcGemini: { color: '#1a73e8' },
  pmIcGa: { color: '#2088ff' },
  pmIcGitlab: { color: '#fc6d26' },
  pmIcCircleci: { color: '#343434' },
  pmIcJenkins: { color: '#d24939' },
  pmIcApple: { color: '#000000' },
  pmIcWindows: { color: '#0078d4' },
  pmIcLinux: { color: '#fcc624' },

  /* --- Section layout --- */
  pmSection: {
    marginTop: '64px',
  },
  pmSwitchSection: {
    marginTop: '56px',
  },

  pmSectionTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '12px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-display)',
    fontWeight: 700,
    lineHeight: 'var(--pm-lh-tight)',
    letterSpacing: '-0.02em',
    color: 'var(--pm-ink)',
    '@media (max-width: 767px)': {
      fontSize: 'clamp(1.5rem, 4.5vw, 1.7rem)',
    },
  },

  pmSectionSub: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '28px',
    marginLeft: 0,
    maxWidth: 620,
    fontSize: 'var(--pm-fs-lead)',
    lineHeight: 1.6,
    color: 'var(--pm-ink-soft)',
    '@media (max-width: 767px)': {
      fontSize: 'var(--pm-fs-title)',
    },
  },

  /* --- Problem cards --- */
  pmProblems: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    listStyle: 'none',
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },

  pmProblem: {
    padding: 28,
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    boxShadow: 'var(--pm-shadow-card)',
    transitionProperty: 'border-color, box-shadow, transform',
    transitionDuration: '0.2s, 0.25s, 0.25s',
    ':hover': {
      borderColor: 'color-mix(in srgb, var(--pm-accent) 40%, var(--pm-border))',
      boxShadow: '0 16px 32px -16px var(--pm-accent-glow)',
      transform: 'translateY(-3px)',
    },
  },

  pmProblemIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    marginBottom: '16px',
    borderRadius: 12,
    color: 'var(--pm-accent)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
  },

  pmProblemName: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '8px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-title)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
  },

  pmProblemDesc: {
    margin: 0,
    fontSize: 'var(--pm-fs-body)',
    lineHeight: 1.55,
    color: 'var(--pm-ink-soft)',
  },

  /* --- Switching reasons --- */
  pmSwitchGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    listStyle: 'none',
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },

  pmSwitchCard: {
    paddingTop: '24px',
    paddingRight: '26px',
    paddingBottom: '24px',
    paddingLeft: '26px',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    boxShadow: 'var(--pm-shadow-card)',
    transitionProperty: 'border-color, box-shadow, transform, background-color',
    transitionDuration: '0.2s, 0.25s, 0.25s, 0.2s',
    ':hover': {
      backgroundColor: 'var(--pm-surface)',
      borderColor: 'color-mix(in srgb, var(--pm-accent) 40%, var(--pm-border))',
      boxShadow:
        '0 16px 32px -16px var(--pm-shadow-lift), 0 0 0 1px color-mix(in srgb, var(--pm-accent) 14%, transparent)',
      transform: 'translateY(-3px)',
    },
    '@media (max-width: 767px)': {
      paddingTop: '22px',
      paddingRight: '20px',
      paddingBottom: '22px',
      paddingLeft: '20px',
    },
  },

  pmSwitchKicker: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '10px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 800,
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    color: 'var(--pm-accent-strong)',
  },

  pmSwitchTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '8px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-title)',
    fontWeight: 700,
    lineHeight: 1.35,
    color: 'var(--pm-ink)',
  },

  pmSwitchDesc: {
    margin: 0,
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.58,
    color: 'var(--pm-ink-soft)',
  },

  /* --- How it works: steps --- */
  pmSteps: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginTop: '24px',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    listStyle: 'none',
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },

  pmStep: {
    paddingTop: '24px',
    paddingRight: '26px',
    paddingBottom: '24px',
    paddingLeft: '26px',
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    boxShadow: 'var(--pm-shadow-card)',
  },

  pmStepNum: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    marginBottom: '14px',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-small)',
    fontWeight: 700,
    color: 'var(--pm-on-accent)',
    backgroundColor: 'var(--pm-accent-strong)',
    borderRadius: 9,
  },

  pmStepTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '8px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-card)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
  },

  pmStepDesc: {
    margin: 0,
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.55,
    color: 'var(--pm-ink-soft)',
  },

  /* --- How it works: flow diagram --- */
  pmFlow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    marginTop: '24px',
    '@media (min-width: 1180px)': {
      display: 'flex',
      alignItems: 'stretch',
      gap: 0,
    },
  },

  pmFlowNode: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    boxShadow: 'var(--pm-shadow-card)',
    paddingTop: '22px',
    paddingRight: '24px',
    paddingBottom: '22px',
    paddingLeft: '24px',
    minWidth: 0,
    '@media (min-width: 1180px)': {
      flex: '1 1 0',
      minWidth: 0,
    },
  },

  pmFlowNodeTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    alignSelf: 'flex-start',
    marginBottom: '10px',
    paddingTop: '3px',
    paddingRight: '11px',
    paddingBottom: '3px',
    paddingLeft: '11px',
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--pm-accent-deep)',
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 9%, var(--pm-wash-base))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 20%, var(--pm-border))',
    borderRadius: 999,
    ':before': {
      content: '""',
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: 'var(--pm-accent)',
    },
  },

  pmFlowNodeTagCore: {
    color: 'var(--pm-on-accent)',
    backgroundColor: 'var(--pm-accent-strong)',
    borderColor: 'transparent',
    ':before': {
      backgroundColor: 'var(--pm-on-accent)',
    },
  },

  pmFlowNodeTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '14px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-title)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
  },

  pmFlowList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },

  pmFlowListItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    minWidth: 0,
  },

  pmFlowListIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 34,
    height: 34,
    marginTop: '1px',
    borderRadius: 9,
    color: 'var(--pm-accent-strong)',
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 12%, transparent)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 16%, transparent)',
  },

  pmFlowListText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '2px',
    minWidth: 0,
  },

  pmFlowListSub: {
    fontSize: 'var(--pm-fs-xs)',
    color: 'var(--pm-ink-faint)',
  },

  /* Core node */
  pmFlowCore: {
    backgroundImage:
      'linear-gradient(180deg, color-mix(in srgb, var(--pm-accent) 6%, var(--pm-wash-base)) 0%, var(--pm-bg-soft) 100%)',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 34%, var(--pm-border))',
    boxShadow:
      'var(--pm-shadow-card), 0 0 0 1px color-mix(in srgb, var(--pm-accent) 8%, transparent)',
  },

  pmFlowCoreHeadMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: 0,
  },

  pmFlowCoreHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px 12px',
    marginBottom: '14px',
    paddingBottom: '14px',
    /* Animated flowing divider instead of a static dashed border. */
    backgroundImage:
      'linear-gradient(90deg, color-mix(in srgb, var(--pm-accent) 50%, transparent) 50%, transparent 50%)',
    backgroundSize: '16px 2px',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: '0 calc(100% - 1px)',
    animationName: dashCore,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },

  pmFlowCoreTitle: {
    margin: 0,
    fontSize: 'var(--pm-fs-title)',
    fontWeight: 700,
    color: 'var(--pm-accent-strong)',
  },

  pmFlowBadge: {
    paddingTop: '4px',
    paddingRight: '10px',
    paddingBottom: '4px',
    paddingLeft: '10px',
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--pm-accent-deep)',
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 14%, var(--pm-wash-base))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 22%, var(--pm-border))',
    borderRadius: 999,
  },

  pmFlowChannels: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },

  pmFlowChannel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '12px',
    paddingRight: '14px',
    paddingBottom: '12px',
    paddingLeft: '14px',
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 20%, var(--pm-border))',
    borderRadius: 12,
  },

  pmFlowChannelIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 36,
    height: 36,
    borderRadius: 10,
    color: 'var(--pm-on-accent)',
    backgroundColor: 'var(--pm-accent-strong)',
    animationName: glow,
    animationDuration: '3s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  },

  pmFlowChannelText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },

  pmFlowChannelName: {
    fontSize: 'var(--pm-fs-body)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
  },

  pmFlowChannelSub: {
    fontSize: 'var(--pm-fs-xs)',
    color: 'var(--pm-ink-faint)',
  },

  /* Live log (element, container; JS appends `.pm-flow-log-line` children —
     those stay on global composites since atomic classes can't reach them). */
  pmFlowLogHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '16px',
    marginRight: 0,
    marginBottom: '6px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--pm-ink-faint)',
  },

  pmFlowLogCount: {
    letterSpacing: 0,
    textTransform: 'none',
    fontVariantNumeric: 'tabular-nums',
    color: 'var(--pm-accent-strong)',
  },

  pmFlowLog: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    height: 126,
    overflow: 'hidden',
    margin: 0,
    paddingTop: '10px',
    paddingRight: '12px',
    paddingBottom: '10px',
    paddingLeft: '12px',
    listStyle: 'none',
    backgroundColor: 'var(--pm-term-bg)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 22%, var(--pm-border))',
    borderRadius: 10,
  },

  pmFlowStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
    paddingTop: '2px',
    paddingRight: '13px',
    paddingBottom: '2px',
    paddingLeft: '13px',
    marginTop: '14px',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    maxWidth: '100%',
    borderRadius: 999,
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 9%, var(--pm-wash-base))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 18%, var(--pm-border))',
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    color: 'var(--pm-accent-deep)',
  },

  pmFlowStatusMsg: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    whiteSpace: 'nowrap',
    ':before': {
      content: '""',
      width: 7,
      height: 7,
      borderRadius: '50%',
      backgroundColor: 'var(--pm-accent)',
      boxShadow: '0 0 6px 1px var(--pm-accent-glow)',
    },
  },

  /* Connector rail (element). The WAAPI packet rides it; the axis custom
     property and the `::before` dash track (with its keyframes) live in
     global.css because the orientation flips in a media query. */
  pmFlowArrow: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    paddingTop: '4px',
    paddingRight: 0,
    paddingBottom: '4px',
    paddingLeft: '16px',
    '--pm-flow-axis': 'y',
    '@media (min-width: 1180px)': {
      flex: '0 0 auto',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      width: 136,
      margin: 0,
      padding: 0,
    },
  },

  pmFlowRailWrap: {
    position: 'relative',
    width: 40,
    height: 72,
    flexShrink: 0,
    '@media (min-width: 1180px)': {
      width: '100%',
      height: 40,
    },
  },

  pmFlowRail: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 5,
    borderRadius: 999,
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 14%, transparent)',
    '@media (min-width: 1180px)': {
      top: '50%',
      bottom: 'auto',
      left: 0,
      right: 0,
      width: 'auto',
      height: 6,
      transform: 'translateY(-50%)',
    },
  },

  pmFlowArrowHead: {
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    zIndex: 1,
    transform: 'translateX(-50%)',
    '@media (min-width: 1180px)': {
      top: '50%',
      right: 0,
      bottom: 'auto',
      left: 'auto',
      transform: 'translate(50%, -50%)',
    },
  },

  pmFlowArrowIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 26,
    height: 26,
    color: 'var(--pm-on-accent)',
    backgroundColor: 'var(--pm-accent-strong)',
    borderRadius: '50%',
    boxShadow: '0 6px 14px -6px var(--pm-accent-glow)',
    '@media (min-width: 1180px)': {
      width: 30,
      height: 30,
    },
  },

  pmFlowPacket: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 10,
    height: 10,
    marginTop: '-5px',
    marginLeft: '-5px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px 3px var(--pm-accent-glow)',
    opacity: 0,
    zIndex: 2,
    pointerEvents: 'none',
  },

  pmFlowArrowLabel: {
    paddingTop: '4px',
    paddingRight: '13px',
    paddingBottom: '4px',
    paddingLeft: '13px',
    textAlign: 'center',
    fontSize: 'var(--pm-fs-xs)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    maxWidth: 120,
    color: 'var(--pm-ink-faint)',
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 9%, var(--pm-wash-base))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 20%, var(--pm-border))',
    borderRadius: 999,
  },

  /* --- Feature grid --- */
  pmFeatures: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (min-width: 1280px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },

  pmFeature: {
    padding: 32,
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    boxShadow: 'var(--pm-shadow-card)',
    transitionProperty: 'border-color, box-shadow, transform',
    transitionDuration: '0.2s, 0.25s, 0.25s',
    ':hover': {
      borderColor: 'color-mix(in srgb, var(--pm-accent) 45%, var(--pm-border))',
      boxShadow: '0 18px 36px -18px var(--pm-accent-glow)',
      transform: 'translateY(-3px)',
    },
    '@media (max-width: 767px)': {
      padding: 24,
    },
  },

  pmFeatureIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    marginBottom: '18px',
    borderRadius: 14,
    color: 'var(--pm-on-accent)',
    backgroundColor: 'var(--pm-accent-strong)',
    boxShadow: '0 10px 20px -8px var(--pm-accent-glow)',
  },

  pmFeatureTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '8px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-feature)',
    fontWeight: 700,
    lineHeight: 1.3,
    color: 'var(--pm-ink)',
  },

  pmFeatureDesc: {
    margin: 0,
    fontSize: 'var(--pm-fs-body)',
    lineHeight: 1.6,
    color: 'var(--pm-ink-soft)',
  },

  /* --- Code blocks --- */
  pmCodeBlock: {
    marginTop: '24px',
    marginRight: 0,
    marginBottom: '24px',
    marginLeft: 0,
    paddingTop: '20px',
    paddingRight: '24px',
    paddingBottom: '20px',
    paddingLeft: '24px',
    overflowX: 'auto',
    color: 'var(--pm-term-text)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.6,
    tabSize: 2,
    backgroundColor: 'var(--pm-term-bg)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(16, 185, 129, 0.18)',
    borderLeftWidth: 3,
    borderLeftColor: 'var(--pm-accent)',
    borderRadius: 10,
    boxShadow: '0 2px 6px -2px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.4)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  pmCodeBlockTight: {
    marginTop: '12px',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },

  pmCodeLabel: {
    display: 'block',
    width: 'fit-content',
    marginTop: 0,
    marginRight: 0,
    marginBottom: '10px',
    marginLeft: 0,
    paddingTop: '3px',
    paddingRight: '10px',
    paddingBottom: '3px',
    paddingLeft: '10px',
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--pm-accent-strong)',
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 12%, transparent)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 18%, transparent)',
    borderRadius: 6,
  },

  /* --- Developer guide --- */
  pmDoc: {
    marginTop: '24px',
  },

  pmDocBase: {
    margin: 0,
    paddingTop: '14px',
    paddingRight: '20px',
    paddingBottom: '14px',
    paddingLeft: '20px',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-body)',
    color: 'var(--pm-term-text)',
    backgroundColor: 'var(--pm-term-bg)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(16, 185, 129, 0.18)',
    borderRadius: 12,
  },

  pmDocBaseLabel: {
    display: 'inline-block',
    marginRight: '14px',
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--pm-term-text)',
    opacity: 0.7,
  },

  pmDocBlock: {
    marginTop: '24px',
    paddingTop: '28px',
    paddingRight: '32px',
    paddingBottom: '28px',
    paddingLeft: '32px',
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    boxShadow: 'var(--pm-shadow-card)',
    '@media (max-width: 767px)': {
      paddingTop: '24px',
      paddingRight: '20px',
      paddingBottom: '24px',
      paddingLeft: '20px',
    },
  },

  pmDocTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '16px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-card)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
  },

  pmDocConventions: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },

  pmDocConvention: {
    paddingTop: '18px',
    paddingRight: '20px',
    paddingBottom: '18px',
    paddingLeft: '20px',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 16%, var(--pm-border))',
    borderRadius: 12,
  },

  pmDocConventionTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '8px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-body)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
  },

  pmDocConventionDesc: {
    margin: 0,
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.55,
    color: 'var(--pm-ink-soft)',
  },

  pmDocGroupTitle: {
    margin: 0,
    paddingBottom: '10px',
    fontSize: 'var(--pm-fs-xs)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--pm-ink-faint)',
    borderBottom: '1px solid var(--pm-border)',
  },

  pmDocEndpoint: {
    marginTop: '22px',
  },

  pmDocHead: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px',
    margin: 0,
    fontSize: 'var(--pm-fs-card)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
  },

  pmMethod: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingTop: '4px',
    paddingRight: '10px',
    paddingBottom: '4px',
    paddingLeft: '10px',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: 'var(--pm-on-accent)',
    backgroundColor: 'var(--pm-accent-strong)',
    borderRadius: 6,
  },

  pmPath: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-small)',
    fontWeight: 600,
    lineHeight: 1.4,
    color: 'var(--pm-ink)',
    wordBreak: 'break-word',
  },

  pmTag: {
    paddingTop: '3px',
    paddingRight: '10px',
    paddingBottom: '3px',
    paddingLeft: '10px',
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    color: 'var(--pm-ink-faint)',
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 10%, var(--pm-wash-base))',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 16%, var(--pm-border))',
    borderRadius: 999,
  },

  pmDocDesc: {
    marginTop: '12px',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    maxWidth: 720,
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.6,
    color: 'var(--pm-ink-soft)',
  },

  pmDocTable: {
    width: '100%',
    marginTop: '12px',
    borderCollapse: 'collapse',
    fontSize: 'var(--pm-fs-small)',
    '@media (max-width: 767px)': {
      display: 'block',
      width: '100%',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
    },
  },

  pmDocSubhead: {
    marginTop: '18px',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--pm-ink-faint)',
  },

  pmDocFootnote: {
    marginTop: '18px',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.55,
    color: 'var(--pm-ink-faint)',
  },

  /* --- Comparison table --- */
  pmTableWrap: {
    maxWidth: '48rem',
    marginTop: '8px',
    overflowX: 'auto',
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    boxShadow: 'var(--pm-shadow-card)',
  },

  pmCompare: {
    width: '100%',
    minWidth: 680,
    borderCollapse: 'collapse',
    fontSize: 'var(--pm-fs-small)',
  },

  pmColPine: {
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 7%, var(--pm-wash-base))',
    color: 'var(--pm-accent-strong)',
  },
  pmSymOk: {
    fontWeight: 700,
    color: 'var(--pm-accent-strong)',
  },
  pmSymNo: {
    fontWeight: 700,
    color: '#b6bcc7',
  },
  pmSymPart: {
    fontWeight: 700,
    color: '#d97706',
  },

  /* --- Install: tabbed quickstart --- */
  pmTabs: {
    marginTop: '24px',
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    boxShadow: 'var(--pm-shadow-card)',
    overflow: 'hidden',
  },

  pmTablist: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    paddingTop: '12px',
    paddingRight: '14px',
    paddingBottom: '12px',
    paddingLeft: '14px',
    backgroundColor: 'var(--pm-bg-soft)',
    borderBottom: '1px solid var(--pm-border)',
  },

  pmTab: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingTop: '9px',
    paddingRight: '16px',
    paddingBottom: '9px',
    paddingLeft: '16px',
    fontSize: 'var(--pm-fs-small)',
    fontWeight: 600,
    lineHeight: 1,
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 10,
    cursor: 'pointer',
    transitionProperty: 'color, background-color, border-color, box-shadow',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    ':hover': {
      color: 'var(--pm-ink)',
      backgroundColor: 'var(--pm-surface)',
      borderColor: 'var(--pm-border)',
    },
    ':focus-visible': {
      outline: '2px solid var(--pm-accent)',
      outlineOffset: '2px',
    },
  },

  pmTabpanel: {
    paddingTop: '20px',
    paddingRight: '22px',
    paddingBottom: '22px',
    paddingLeft: '22px',
  },

  pmCodebox: {
    backgroundColor: 'var(--pm-term-bg)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(16, 185, 129, 0.18)',
    borderRadius: 12,
    overflow: 'hidden',
  },

  pmCodeboxHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    paddingTop: '8px',
    paddingRight: '14px',
    paddingBottom: '8px',
    paddingLeft: '14px',
    backgroundColor: 'color-mix(in srgb, #ffffff 4%, transparent)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
  },

  pmCodeboxTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    letterSpacing: '0.02em',
    color: '#94a3b8',
  },

  pmCodeCopy: {
    paddingTop: '4px',
    paddingRight: '10px',
    paddingBottom: '4px',
    paddingLeft: '10px',
    fontSize: '0.78rem',
    fontWeight: 600,
    lineHeight: 1,
    color: '#cbd5e1',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 6,
    cursor: 'pointer',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    ':hover': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(203, 213, 225, 0.45)',
    },
    ':focus-visible': {
      outline: '2px solid var(--pm-accent)',
      outlineOffset: '2px',
    },
  },

  pmInstallCode: {
    margin: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-xs)',
    lineHeight: 1.6,
    color: 'var(--pm-term-text)',
    padding: 16,
    whiteSpace: 'pre',
    overflowX: 'auto',
    tabSize: 4,
  },

  pmInstallNote: {
    marginTop: '12px',
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.55,
    color: 'var(--pm-ink-faint)',
  },

  /* --- MCP tools: grouped columns --- */
  pmToolsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    marginTop: '24px',
    alignItems: 'start',
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },

  pmToolsGroupTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '10px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-xs)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--pm-ink-faint)',
  },

  pmTools: {
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'var(--pm-surface)',
  },

  pmTool: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '16px',
    paddingRight: '22px',
    paddingBottom: '16px',
    paddingLeft: '22px',
    transitionProperty: 'background-color, color',
    transitionDuration: '0.25s',
    transitionTimingFunction: 'ease',
    ':hover': {
      backgroundColor: 'var(--pm-accent-strong)',
    },
    ':focus-within': {
      backgroundColor: 'var(--pm-accent-strong)',
    },
  },

  pmToolIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 38,
    height: 38,
    borderRadius: 10,
    color: 'var(--pm-accent-strong)',
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 14%, transparent)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 16%, transparent)',
  },

  pmToolMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    flex: '1 1 auto',
  },

  pmToolName: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: 0,
    fontSize: 'var(--pm-fs-body)',
    fontWeight: 700,
    lineHeight: 1.3,
    color: 'var(--pm-ink)',
    fontFamily: 'var(--font-mono)',
    wordBreak: 'break-word',
  },

  pmToolArrow: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 26,
    height: 26,
    borderRadius: 8,
    color: 'var(--pm-accent-strong)',
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 12%, transparent)',
  },

  pmToolDesc: {
    margin: 0,
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.5,
    color: 'var(--pm-ink-soft)',
  },

  /* --- Agent workflow timeline --- */
  pmWorkflow: {
    marginTop: '28px',
    paddingTop: '28px',
    paddingRight: '32px',
    paddingBottom: '28px',
    paddingLeft: '32px',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    '@media (max-width: 767px)': {
      paddingTop: '24px',
      paddingRight: '20px',
      paddingBottom: '24px',
      paddingLeft: '20px',
    },
  },

  pmWorkflowTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '20px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-lead)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
  },

  pmWorkflowSteps: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },

  pmWorkflowStep: {
    borderTopWidth: 3,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--pm-accent)',
    paddingTop: '14px',
  },

  pmWorkflowNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-small)',
    fontWeight: 700,
    color: 'var(--pm-accent-strong)',
  },

  /* --- Stats row --- */
  pmStats: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginTop: '8px',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    listStyle: 'none',
    '@media (min-width: 900px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },

  pmStat: {
    paddingTop: '24px',
    paddingRight: '20px',
    paddingBottom: '24px',
    paddingLeft: '20px',
    textAlign: 'center',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
  },

  pmStatValue: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '4px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-display)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--pm-accent-strong)',
  },

  pmStatLabel: {
    margin: 0,
    fontSize: 'var(--pm-fs-xs)',
    fontWeight: 600,
    color: 'var(--pm-ink-faint)',
  },

  /* --- FAQ (details element; internals are composite — StyleX can't flip
       the `+`/`−` marker, hide the summary marker, or style bare summary/p) --- */
  pmFaq: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    marginTop: '8px',
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: 'var(--pm-shadow-card)',
  },

  pmFaqItem: {
    backgroundColor: 'var(--pm-surface)',
    borderWidth: 0,
    borderRadius: 0,
    transitionProperty: 'background-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    ':hover': {
      backgroundColor: 'var(--pm-bg-soft)',
    },
  },

  /* --- CTA box --- */
  pmCtaBox: {
    marginTop: '64px',
    marginBottom: '80px',
    paddingTop: '56px',
    paddingRight: '40px',
    paddingBottom: '56px',
    paddingLeft: '40px',
    textAlign: 'center',
    backgroundImage:
      'radial-gradient(760px 320px at 50% -40%, color-mix(in srgb, var(--pm-accent) 16%, transparent), transparent 70%), linear-gradient(180deg, #0d1522 0%, var(--pm-term-bg) 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 24,
    '@media (max-width: 767px)': {
      paddingTop: '32px',
      paddingRight: '20px',
      paddingBottom: '32px',
      paddingLeft: '20px',
    },
  },

  pmCtaTitle: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: '10px',
    marginLeft: 0,
    fontSize: 'var(--pm-fs-display)',
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: '-0.02em',
    color: '#f8fafc',
    '@media (max-width: 767px)': {
      fontSize: '1.55rem',
    },
  },

  pmCtaText: {
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: '20px',
    marginLeft: 'auto',
    maxWidth: 520,
    fontSize: 'var(--pm-fs-card)',
    lineHeight: 1.6,
    color: '#94a3b8',
  },

  pmCtaActions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '12px',
    '@media (max-width: 767px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },

  /* --- Buttons (anchors, always inside `.pm-page`) --- */
  pmCta: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    paddingTop: '13px',
    paddingRight: '28px',
    paddingBottom: '13px',
    paddingLeft: '28px',
    fontSize: 'var(--pm-fs-body)',
    fontWeight: 600,
    lineHeight: 1.2,
    color: 'var(--pm-on-accent)',
    backgroundColor: 'var(--pm-accent-strong)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--pm-accent-deep) 35%, transparent)',
    borderRadius: 999,
    textDecoration: 'none',
    boxShadow: 'var(--pm-shadow-accent), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
    transitionProperty: 'box-shadow, transform, background-color, border-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    ':hover': {
      color: 'var(--pm-on-accent)',
      backgroundColor: 'var(--pm-accent-deep)',
      borderColor: 'var(--pm-accent-deep)',
      boxShadow: '0 12px 26px -6px var(--pm-accent-glow), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
      transform: 'translateY(-2px)',
      textDecoration: 'none',
    },
    ':focus-visible': {
      color: 'var(--pm-on-accent)',
      backgroundColor: 'var(--pm-accent-deep)',
      borderColor: 'var(--pm-accent-deep)',
      boxShadow: '0 12px 26px -6px var(--pm-accent-glow), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
      transform: 'translateY(-2px)',
      textDecoration: 'none',
    },
    ':active': {
      transform: 'translateY(0)',
      borderColor: 'var(--pm-accent-deep)',
      boxShadow: '0 4px 12px -4px var(--pm-accent-glow), inset 0 2px 4px rgba(0, 0, 0, 0.18)',
      backgroundColor: 'color-mix(in srgb, var(--pm-accent-strong) 92%, #000)',
    },
  },

  pmCtaGhost: {
    color: 'var(--pm-accent-strong)',
    backgroundColor: 'var(--pm-surface)',
    borderColor: 'color-mix(in srgb, var(--pm-accent) 34%, var(--pm-border))',
    boxShadow: 'none',
    transitionProperty: 'box-shadow, transform, background-color, border-color, color',
    ':hover': {
      color: 'var(--pm-accent-deep)',
      backgroundColor: 'var(--pm-bg-soft)',
      borderColor: 'color-mix(in srgb, var(--pm-accent) 52%, var(--pm-border))',
      boxShadow: '0 8px 20px -8px var(--pm-accent-glow)',
      transform: 'translateY(-2px)',
      filter: 'none',
      textDecoration: 'none',
    },
    ':focus-visible': {
      color: 'var(--pm-accent-deep)',
      backgroundColor: 'var(--pm-bg-soft)',
      borderColor: 'color-mix(in srgb, var(--pm-accent) 52%, var(--pm-border))',
      boxShadow: '0 8px 20px -8px var(--pm-accent-glow)',
      transform: 'translateY(-2px)',
      filter: 'none',
      textDecoration: 'none',
    },
    ':active': {
      color: 'var(--pm-accent-deep)',
      transform: 'translateY(0)',
      boxShadow: 'none',
    },
  },
})