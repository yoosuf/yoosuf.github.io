import type { MermaidConfig } from 'mermaid'

export type MermaidVariant = 'pencil' | 'marker'

export const mermaidConfig: MermaidConfig = {
  startOnLoad: false,
  securityLevel: 'strict',
  look: 'handDrawn',
  handDrawnSeed: 42,
  theme: 'base',
}

// Keep the pencil treatment local to Mermaid's SVG text. These are platform
// fonts, so diagrams remain self-contained and gracefully fall back to the
// browser's cursive face when a handwriting font is unavailable.
const pencilFontFamily = '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive'

// Palette pairs mirror the light/dark values in diagramTokens.stylex.ts so the
// diagram SVG and its surrounding surface agree in both schemes. Mermaid bakes
// these into the SVG at render time (it can't consume CSS `light-dark()`), so
// the active scheme is resolved with matchMedia before rendering.
const palette = {
  pencil: {
    light: {
      background: '#fffdf7',
      primaryColor: '#fffdf7',
      primaryTextColor: '#34332f',
      primaryBorderColor: '#5b5952',
      lineColor: '#5b5952',
      secondaryColor: '#f4f0e7',
      tertiaryColor: '#ebe6da',
      textColor: '#34332f',
    },
    dark: {
      background: '#1b1b19',
      primaryColor: '#1b1b19',
      primaryTextColor: '#e4e1d8',
      primaryBorderColor: '#c4c0b5',
      lineColor: '#c4c0b5',
      secondaryColor: '#292824',
      tertiaryColor: '#33312c',
      textColor: '#e4e1d8',
    },
  },
  marker: {
    light: {
      background: '#ffffff',
      primaryColor: '#ffffff',
      primaryTextColor: '#20201e',
      primaryBorderColor: '#403e39',
      lineColor: '#403e39',
      secondaryColor: '#f5f5f3',
      tertiaryColor: '#ecebe7',
      textColor: '#20201e',
    },
    dark: {
      background: '#20201e',
      primaryColor: '#20201e',
      primaryTextColor: '#eeeae0',
      primaryBorderColor: '#d4d0c5',
      lineColor: '#d4d0c5',
      secondaryColor: '#2b2a27',
      tertiaryColor: '#34332f',
      textColor: '#eeeae0',
    },
  },
} as const

export type MermaidScheme = 'light' | 'dark'

export function prefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function configForVariant(
  variant: MermaidVariant,
  scheme: MermaidScheme = prefersDark() ? 'dark' : 'light',
): MermaidConfig {
  return {
    ...mermaidConfig,
    themeVariables: {
      ...palette[variant][scheme],
      fontFamily: variant === 'pencil' ? pencilFontFamily : 'ui-sans-serif, system-ui, sans-serif',
    },
  }
}
