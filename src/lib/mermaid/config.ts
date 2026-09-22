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

const themeVariables = {
  pencil: {
    background: '#fffdf7',
    primaryColor: '#fffdf7',
    primaryTextColor: '#34332f',
    primaryBorderColor: '#5b5952',
    lineColor: '#5b5952',
    secondaryColor: '#f4f0e7',
    tertiaryColor: '#ebe6da',
    textColor: '#34332f',
    fontFamily: pencilFontFamily,
  },
  marker: {
    background: '#ffffff',
    primaryColor: '#ffffff',
    primaryTextColor: '#20201e',
    primaryBorderColor: '#403e39',
    lineColor: '#403e39',
    secondaryColor: '#f5f5f3',
    tertiaryColor: '#ecebe7',
    textColor: '#20201e',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
} as const

export function configForVariant(variant: MermaidVariant): MermaidConfig {
  return {
    ...mermaidConfig,
    themeVariables: themeVariables[variant],
  }
}
