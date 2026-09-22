import * as stylex from '@stylexjs/stylex'

// Diagram tokens deliberately stay semantic and pair with the site's existing
// light/dark palette. Mermaid consumes the same values through its adapter.
export const diagramTokens = stylex.defineVars({
  pencilSurface: 'light-dark(#fffdf7, #1b1b19)',
  pencilBorder: 'light-dark(#d7d2c7, #4a4944)',
  pencilInk: 'light-dark(#34332f, #e4e1d8)',
  pencilMutedInk: 'light-dark(#68655d, #aaa69c)',
  pencilLine: 'light-dark(#5b5952, #c4c0b5)',
  pencilGrid: 'light-dark(rgba(70, 67, 61, 0.06), rgba(235, 231, 220, 0.045))',
  markerSurface: 'light-dark(#ffffff, #20201e)',
  markerBorder: 'light-dark(#bdbab2, #68655d)',
  markerInk: 'light-dark(#20201e, #eeeae0)',
  markerMutedInk: 'light-dark(#5f5c55, #b8b4aa)',
  markerLine: 'light-dark(#403e39, #d4d0c5)',
  error: 'light-dark(#9b2c2c, #f09a9a)',
  focus: 'light-dark(#2563eb, #8bb0ff)',
})
