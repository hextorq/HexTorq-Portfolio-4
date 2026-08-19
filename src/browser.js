/**
 * Browser detection for background quality selection.
 *
 * Edge renders the full WebGL scene smoothly on all devices, while Chrome
 * (and other non-Edge browsers) fall back to the lightweight CSS-only
 * background to avoid the heavy 3D feel.
 */

const isBrowser = () => typeof navigator !== 'undefined'

export const isEdgeBrowser = () =>
  isBrowser() && /Edg\/|Edge\//.test(navigator.userAgent)

export const isChromeBrowser = () =>
  isBrowser() &&
  /Chrome\/|Chromium\//.test(navigator.userAgent) &&
  !isEdgeBrowser()

export const useFull3DBackground = () =>
  isBrowser() && isEdgeBrowser()