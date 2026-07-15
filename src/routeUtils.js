export const routeToSection = {
  '/': 'top',
  '/about/': 'story',
  '/services/': 'services',
  '/products/': 'products',
  '/projects/': 'projects',
  '/process/': 'process',
  '/contact/': 'contact',
}

const sectionToRoute = {
  top: '/',
  story: '/about/',
  services: '/services/',
  products: '/products/',
  projects: '/projects/',
  process: '/process/',
  contact: '/contact/',
}

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

export function routeForSection(sectionId) {
  return sectionToRoute[sectionId] || '/'
}

export function currentSectionFromPath() {
  if (typeof window === 'undefined') return null
  return routeToSection[normalizePath(window.location.pathname)] || null
}

export function pushRouteForSection(sectionId) {
  if (typeof window === 'undefined') return
  const route = routeForSection(sectionId)
  if (normalizePath(window.location.pathname) !== route) {
    window.history.pushState({}, '', route)
  }
}

export function scrollToSection(sectionId, lenisRef, options = {}) {
  const el = document.getElementById(sectionId)
  if (!el) return
  const offset = options.offset ?? -20
  const duration = options.duration ?? 1.4
  if (lenisRef?.current) lenisRef.current.scrollTo(el, { offset, duration })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function templateUrls() {
  const raw = import.meta.env.VITE_TEMPLATE_URLS || ''
  return raw
    .split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean)
}
