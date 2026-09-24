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
 * Runtime states are represented by explicit data/StyleX variants or by
 * vanilla event handlers. Generated Postwire markup spreads these attrs.
 */

export const styles = stylex.create({
  /* Page shell — hard guarantee against horizontal page scroll from the flow
     diagram and wide code blocks (tables scroll internally). */
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
      'linear-gradient(180deg, #141414 0%, var(--pm-term-bg) 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderBottom: '1px solid rgba(160, 160, 160, 0.14)',
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
    color: '#d6d6d6',
    backgroundColor: 'rgba(160, 160, 160, 0.08)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(160, 160, 160, 0.22)',
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
    color: '#f6f6f6',
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
    color: '#b3b3b3',
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

  pmHeroCheck: {
    alignItems: 'center',
    color: '#d6d6d6',
    display: 'flex',
    fontSize: 'var(--pm-fs-small)',
    fontWeight: 600,
    gap: '8px',
  },

  pmHeroCheckIcon: {
    color: '#b3b3b3',
    flexShrink: 0,
    height: 15,
    strokeWidth: 3,
    width: 15,
  },

  pmHeroRight: {
    minWidth: 0,
  },

  pmBrandIcon: {
    flexShrink: 0,
    height: 22,
    width: 22,
  },

  /* --- Terminal mockup --- */
  pmTerminal: {
    backgroundColor: 'var(--pm-term-bg)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 24px 60px -24px rgba(0, 0, 0, 0.6), 0 0 1px rgba(0, 0, 0, 0.4)',
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
    borderBottom: '1px solid rgba(160, 160, 160, 0.16)',
    backgroundColor: 'color-mix(in srgb, #fff 4%, transparent)',
  },

  pmTerminalDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
  },
  pmTerminalDotRed: {
    backgroundColor: '#52525b',
  },
  pmTerminalDotYellow: {
    backgroundColor: '#44444c',
  },
  pmTerminalDotGreen: {
    backgroundColor: '#3f3f46',
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
    color: '#e5e5e5',
  },
  pmOk: {
    fontWeight: 700,
    color: '#f6f6f6',
  },

  /* --- Subnav --- */
  pmSubnav: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backgroundColor: 'var(--pm-nav-bg)',
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
      color: 'var(--pm-ink)',
    },
  },

  /* --- "Built for" strip --- */
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
      borderColor: 'var(--pm-border-strong)',
      boxShadow: 'var(--pm-shadow-lift)',
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
    color: 'var(--pm-ink-soft)',
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
      borderColor: 'var(--pm-border-strong)',
      boxShadow: 'var(--pm-shadow-lift)',
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
    color: 'var(--pm-ink-faint)',
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
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
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
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 999,
    ':before': {
      content: '""',
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: 'var(--pm-ink-faint)',
    },
  },

  pmFlowNodeTagCore: {
    color: 'var(--pm-surface)',
    backgroundColor: 'var(--pm-ink)',
    borderColor: 'transparent',
    ':before': {
      backgroundColor: 'var(--pm-surface)',
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
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
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
      'linear-gradient(180deg, var(--pm-surface) 0%, var(--pm-bg-soft) 100%)',
    borderColor: 'var(--pm-border-strong)',
    boxShadow: 'var(--pm-shadow-card)',
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
    /* Static dashed flow divider — no per-frame animation (smooth scroll). */
    backgroundImage:
      'linear-gradient(90deg, var(--pm-border-strong) 50%, transparent 50%)',
    backgroundSize: '16px 2px',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: '0 calc(100% - 1px)',
  },

  pmFlowCoreTitle: {
    margin: 0,
    fontSize: 'var(--pm-fs-title)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
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
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
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
    borderColor: 'var(--pm-border)',
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
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
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

  /* Live log (element, container; the initial rows are authored in the page
     markup and stay on global composites since atomic classes can't reach
     them). */
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
    color: 'var(--pm-term-text)',
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
    borderColor: 'var(--pm-border)',
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
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    color: 'var(--pm-ink-soft)',
  },

  pmFlowStatusMsg: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    whiteSpace: 'nowrap',
  },

  pmFlowStatusDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: 'var(--pm-ink-soft)',
    boxShadow: 'none',
  },

  pmFlowLogLine: {
    flexShrink: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-tiny)',
    lineHeight: 1.65,
    color: '#b3b3b3',
  },

  pmFlowLogTime: {
    marginRight: 8,
    color: '#8f8f8f',
  },

  pmFlowLogHit: {
    color: '#f6f6f6',
  },

  pmFlowLogHitTime: {
    color: '#b3b3b3',
  },

  /* Connector rail and its visible dash track are explicit child elements. */
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
    backgroundColor: 'color-mix(in srgb, var(--pm-ink-soft) 24%, transparent)',
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

  pmFlowRailTrack: {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundImage: 'linear-gradient(180deg, color-mix(in srgb, var(--pm-ink-soft) 55%, transparent) 50%, transparent 50%)',
    backgroundSize: '5px 14px',
    backgroundRepeat: 'repeat-y',
    '@media (min-width: 1180px)': {
      backgroundImage: 'linear-gradient(90deg, color-mix(in srgb, var(--pm-ink-soft) 55%, transparent) 50%, transparent 50%)',
      backgroundSize: '14px 6px',
      backgroundRepeat: 'repeat-x',
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
    color: 'var(--pm-bg-soft)',
    backgroundColor: 'var(--pm-ink)',
    borderRadius: '50%',
    boxShadow: 'none',
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
    backgroundColor: 'var(--pm-ink)',
    boxShadow: '0 0 8px 2px color-mix(in srgb, var(--pm-ink) 35%, transparent)',
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
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
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
      borderColor: 'var(--pm-border-strong)',
      boxShadow: 'var(--pm-shadow-lift)',
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
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    boxShadow: 'none',
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
    borderColor: 'var(--pm-border)',
    borderLeftWidth: 3,
    borderLeftColor: 'var(--pm-border-strong)',
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
    color: 'var(--pm-ink-faint)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
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
    borderColor: 'var(--pm-border)',
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
    borderColor: 'var(--pm-border)',
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
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
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
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
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

  /* --- Guide links + schema table (product docs) --- */
  pmGuideLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '12px',
    fontSize: 'var(--pm-fs-small)',
    fontWeight: 600,
    color: 'var(--pm-accent-strong)',
    textDecoration: 'none',
    transitionProperty: 'color',
    transitionDuration: '0.15s',
    ':hover': {
      color: 'var(--pm-accent-deep)',
      textDecorationLine: 'underline',
      textUnderlineOffset: 3,
    },
  },

  pmTableCode: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.95em',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    color: 'var(--pm-ink)',
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

  pmColPostwire: {
    backgroundColor: 'color-mix(in srgb, var(--pm-accent) 7%, var(--pm-wash-base))',
    color: 'var(--pm-accent-strong)',
  },
  pmSymOk: {
    fontWeight: 700,
    color: 'var(--pm-accent-strong)',
  },
  pmSymNo: {
    fontWeight: 700,
    color: '#8f8f8f',
  },
  pmSymPart: {
    fontWeight: 700,
    color: 'var(--pm-ink-soft)',
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
    paddingTop: { default: '11px', '@media (max-width: 767px)': '14px' },
    paddingRight: '16px',
    paddingBottom: { default: '11px', '@media (max-width: 767px)': '14px' },
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
    borderColor: 'var(--pm-border)',
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
    borderBottom: '1px solid rgba(160, 160, 160, 0.14)',
  },

  pmCodeboxTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    letterSpacing: '0.02em',
    color: '#b3b3b3',
  },

  pmCodeCopy: {
    alignItems: 'center',
    display: 'inline-flex',
    paddingTop: { default: '7px', '@media (max-width: 767px)': '11px' },
    paddingRight: '10px',
    paddingBottom: { default: '7px', '@media (max-width: 767px)': '11px' },
    paddingLeft: '10px',
    fontSize: '0.78rem',
    fontWeight: 600,
    lineHeight: 1,
    color: '#d6d6d6',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(160, 160, 160, 0.3)',
    borderRadius: 6,
    cursor: 'pointer',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    ':hover': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(160, 160, 160, 0.45)',
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
    color: 'var(--pm-ink)',
    ':hover': {
      backgroundColor: 'var(--pm-bg-soft)',
      color: 'var(--pm-ink)',
    },
    ':focus-within': {
      backgroundColor: 'var(--pm-bg-soft)',
      color: 'var(--pm-ink)',
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
    color: 'var(--pm-ink-soft)',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
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
    color: 'inherit',
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
    color: 'inherit',
    backgroundColor: 'var(--pm-bg-soft)',
  },

  pmToolDesc: {
    margin: 0,
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.5,
    color: 'inherit',
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
    borderTopColor: 'var(--pm-border-strong)',
    paddingTop: '14px',
  },

  pmWorkflowNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--pm-fs-small)',
    fontWeight: 700,
    color: 'var(--pm-ink-soft)',
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
    color: 'var(--pm-ink)',
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
    marginTop: '1.25rem',
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

  pmFaqSummary: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    gap: 16,
    justifyContent: 'space-between',
    listStyleType: 'none',
    margin: 0,
    paddingBlock: '1.25rem',
    paddingInline: '1.25rem',
    fontSize: 'var(--pm-fs-body)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
  },

  pmFaqBody: {
    paddingBlockEnd: '1.25rem',
    paddingBlockStart: '0.15rem',
    paddingInline: '1.25rem',
  },

  pmFaqAnswer: {
    color: 'var(--pm-ink-soft)',
    fontSize: '0.925rem',
    lineHeight: 1.625,
    margin: 0,
    maxWidth: '44rem',
    padding: 0,
    textWrap: 'pretty',
  },

  pmFaqChevron: {
    color: 'var(--pm-ink-soft)',
    flexShrink: 0,
    transitionDuration: '0.2s',
    transitionProperty: 'transform,color',
  },

  pmTableCell: {
    paddingBlock: 13,
    paddingInline: 18,
    textAlign: 'left',
    verticalAlign: 'top',
    borderBlockEndColor: 'var(--pm-border)',
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
  },

  pmTableHeader: {
    fontSize: 'var(--pm-fs-small)',
    fontWeight: 700,
    color: 'var(--pm-ink)',
    backgroundColor: 'var(--pm-bg-soft)',
  },

  pmDocTableCell: {
    paddingBlock: 8,
    paddingInline: 14,
  },

  pmDocTableHeader: {
    fontSize: 'var(--pm-fs-tiny)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--pm-ink-faint)',
    backgroundColor: 'var(--pm-bg-soft)',
  },

  pmInlineCode: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9em',
    paddingBlock: '0.15em',
    paddingInline: '0.4em',
    backgroundColor: 'var(--pm-bg-soft)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--pm-border)',
    borderRadius: 6,
    color: 'var(--pm-ink)',
  },

  pmWorkflowStepText: {
    marginTop: 6,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    fontSize: 'var(--pm-fs-small)',
    lineHeight: 1.55,
    color: 'var(--pm-ink-soft)',
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
      'linear-gradient(180deg, #141414 0%, var(--pm-term-bg) 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(160, 160, 160, 0.16)',
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
    color: '#f6f6f6',
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
    color: '#b3b3b3',
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

  /* --- Buttons (anchors, always inside `.pm-page`). Colors follow the site's
     shared accent from tokens.stylex.ts (`colors.accent`/`accentStrong`/
     `onAccent`) — an unshaded `light-dark()` blue, never the per-product
     `--pm-accent` brand hue. --- */
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
    color: 'light-dark(#ffffff, #1a1a1a)',
    backgroundColor: 'light-dark(#2563eb, #8bb0ff)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 999,
    textDecoration: 'none',
    transitionProperty: 'background-color, transform',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    ':hover': {
      color: 'light-dark(#ffffff, #1a1a1a)',
      backgroundColor: 'light-dark(#1d4ed8, #a9c4ff)',
      borderColor: 'transparent',
      transform: 'translateY(-2px)',
      textDecoration: 'none',
    },
    ':focus-visible': {
      color: 'light-dark(#ffffff, #1a1a1a)',
      backgroundColor: 'light-dark(#1d4ed8, #a9c4ff)',
      borderColor: 'transparent',
      transform: 'translateY(-2px)',
      textDecoration: 'none',
    },
    ':active': {
      transform: 'translateY(0)',
      backgroundColor: 'light-dark(#1d4ed8, #a9c4ff)',
    },
  },

  pmCtaGhost: {
    color: 'var(--pm-term-text)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(160, 160, 160, 0.35)',
    boxShadow: 'none',
    transitionProperty: 'box-shadow, transform, background-color, border-color, color',
    ':hover': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(160, 160, 160, 0.55)',
      boxShadow: 'none',
      transform: 'translateY(-2px)',
      filter: 'none',
      textDecoration: 'none',
    },
    ':focus-visible': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(160, 160, 160, 0.55)',
      boxShadow: 'none',
      transform: 'translateY(-2px)',
      filter: 'none',
      textDecoration: 'none',
    },
    ':active': {
      color: 'var(--pm-term-text)',
      transform: 'translateY(0)',
      boxShadow: 'none',
    },
  },
})
