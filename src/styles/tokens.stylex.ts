import * as stylex from '@stylexjs/stylex'

// Semantic tokens — the single vocabulary components consume. The literal
// values below ARE the primitives (raw, decoded — e.g. the light/dark hex
// pair for each semantic colour) mapped to meaning. StyleX requires static
// literals here, so the palette lives in this file rather than a shared
// consts module.
//
// Colours pair both palettes inline via the CSS `light-dark()` function and
// resolve against the `color-scheme` declared on the document shell — no theme
// objects or wrappers needed for system dark mode. Values preserve
// parity with the previous Tailwind `@theme` (bg/wash/accent maps to the old
// paper/wash/accent; text* maps to ink/mid/sub/faint).

export const colors = stylex.defineVars({
  // light-dark(<light>, <dark>)
  bg: 'light-dark(#ffffff, #0e0e0e)',
  text: 'light-dark(#1a1a1a, #e6e6e6)',
  textMuted: 'light-dark(#4a4a4a, #b0b0b0)',
  textDim: 'light-dark(#7a7a7a, #858585)',
  textFaint: 'light-dark(#9e9e9e, #5f5f5f)',
  border: 'light-dark(#e5e5e5, #2b2b2b)',
  wash: 'light-dark(#f6f6f6, #171717)',
  accent: 'light-dark(#2563eb, #8bb0ff)',
  accentStrong: 'light-dark(#1d4ed8, #a9c4ff)',
  onAccent: 'light-dark(#ffffff, #1a1a1a)',

  // Tuned alpha blends (mixing the concrete palette pairs) for soft washes,
  // translucent borders, and hover tints that had `/<alpha>` Tailwind syntax.
  washSoft: 'light-dark(color-mix(in srgb, #f6f6f6 70%, #ffffff), color-mix(in srgb, #171717 70%, #0e0e0e))',
  accentSoftBg: 'light-dark(color-mix(in srgb, #2563eb 10%, #ffffff), color-mix(in srgb, #8bb0ff 14%, #0e0e0e))',
  accentBorder: 'light-dark(color-mix(in srgb, #2563eb 25%, #ffffff), color-mix(in srgb, #8bb0ff 28%, #0e0e0e))',
  accentBorderHover: 'light-dark(color-mix(in srgb, #2563eb 40%, #ffffff), color-mix(in srgb, #8bb0ff 45%, #0e0e0e))',
  accentShadow: 'light-dark(color-mix(in srgb, #2563eb 45%, transparent), color-mix(in srgb, #8bb0ff 45%, transparent))',
  borderSubtle: 'light-dark(color-mix(in srgb, #1a1a1a 15%, transparent), color-mix(in srgb, #e6e6e6 18%, transparent))',
  borderStrong: 'light-dark(color-mix(in srgb, #1a1a1a 30%, transparent), color-mix(in srgb, #e6e6e6 30%, transparent))',
})

// Layout / spacing scale, in rem (Tailwind-style increments).
export const space = stylex.defineVars({
  '0': '0px',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
})

export const radii = stylex.defineVars({
  xs: '0.25rem', // 4
  sm: '0.375rem', // 6
  md: '0.5rem', // 8
  lg: '0.75rem', // 12
  xl: '1rem', // 16
})

export const fonts = stylex.defineVars({
  sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
})

export const typeScale = stylex.defineVars({
  xs: '0.8rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.05rem',
  xl: '1.25rem',
  '2xl': '2rem',
  '3xl': '2.4rem',
})

export const lineHeights = stylex.defineVars({
  snug: '1.375', // old leading-snug
  base: '1.7', // body default
  relaxed: '1.625', // old leading-relaxed
})

export const weights = stylex.defineVars({
  normal: '400',
  medium: '500',
  semibold: '600',
})

export const letterSpacing = stylex.defineVars({
  tight: '-0.025em',
  wide: '0.14em',
})
