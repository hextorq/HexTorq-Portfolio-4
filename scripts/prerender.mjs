import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  BASE_URL,
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
  SERVICES_SCHEMA,
  FAQ_SCHEMA,
  ROUTE_SEO_MAP,
  getBreadcrumbSchema,
} from '../src/seo/routeSeo.js'

const root = process.cwd()
const dist = resolve(root, 'dist')
const templatePath = resolve(dist, 'index.html')
const serverEntry = resolve(dist, 'server/entry-server.js')
const routes = Object.keys(ROUTE_SEO_MAP)

const template = await readFile(templatePath, 'utf8')
const { render } = await import(pathToFileURL(serverEntry).href)

for (const route of routes) {
  const seo = ROUTE_SEO_MAP[route] || ROUTE_SEO_MAP['/']
  const appHtml = render(route)

  const breadcrumbSchema = getBreadcrumbSchema(seo.breadcrumb)
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${seo.canonical}#webpage`,
    url: seo.canonical,
    name: seo.title,
    description: seo.description,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#organization` },
  }

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      ORGANIZATION_SCHEMA,
      WEBSITE_SCHEMA,
      webPageSchema,
      breadcrumbSchema,
      ...(route === '/' || route === '/services/' ? SERVICES_SCHEMA : []),
      ...(route === '/' || route === '/services/' || route === '/about/' ? [FAQ_SCHEMA] : []),
    ],
  }

  const headInjection = `
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
    <meta name="keywords" content="${seo.keywords}" />
    <link rel="canonical" href="${seo.canonical}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${seo.ogType || 'website'}" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:image" content="${seo.ogImage}" />
    <meta property="og:site_name" content="Hextorq" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${seo.canonical}" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />
    <meta name="twitter:image" content="${seo.ogImage}" />

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
      ${JSON.stringify(jsonLdGraph, null, 2)}
    </script>
  `

  let pageHtml = template
    .replace(/<title>.*?<\/title>/s, '')
    .replace(/<meta name="description".*?\/>/s, '')
    .replace(/<!-- Open Graph -->[\s\S]*?<\/head>/s, '</head>')

  pageHtml = pageHtml.replace('</head>', `${headInjection}\n  </head>`)
  pageHtml = pageHtml.replace(
    '<div id="root"><!--app-html--></div>',
    `<div id="root" data-prerendered="true">${appHtml}</div>`
  )

  const outputPath =
    route === '/'
      ? templatePath
      : resolve(dist, route.replace(/^\/|\/$/g, ''), 'index.html')

  await mkdir(resolve(outputPath, '..'), { recursive: true })
  await writeFile(outputPath, pageHtml)
}

await rm(resolve(dist, 'server'), { recursive: true, force: true })
console.log('Successfully prerendered SSG HTML pages with route-specific SEO & JSON-LD Schemas!')
