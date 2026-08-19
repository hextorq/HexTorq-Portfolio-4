/**
 * Microsoft Clarity helper utilities
 */
export function trackClarityPageView(path) {
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    try {
      window.clarity('set', 'route', path || window.location.pathname)
      window.clarity('set', 'parent_referrer', document.referrer || 'direct')
      window.clarity('set', 'is_iframe', window.self !== window.top ? 'true' : 'false')
    } catch (e) {
      // silently handle analytics errors
    }
  }
}
