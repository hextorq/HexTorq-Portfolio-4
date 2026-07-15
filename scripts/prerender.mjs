import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = resolve(root, 'dist')
const templatePath = resolve(dist, 'index.html')
const serverEntry = resolve(dist, 'server/entry-server.js')
const routes = [
  '/',
  '/about/',
  '/services/',
  '/products/',
  '/projects/',
  '/process/',
  '/contact/',
]

const template = await readFile(templatePath, 'utf8')
const { render } = await import(pathToFileURL(serverEntry).href)

for (const route of routes) {
  const appHtml = render(route)
  const html = template.replace(
    '<div id="root"><!--app-html--></div>',
    `<div id="root" data-prerendered="true">${appHtml}</div>`
  )
  const outputPath =
    route === '/'
      ? templatePath
      : resolve(dist, route.replace(/^\/|\/$/g, ''), 'index.html')

  await mkdir(resolve(outputPath, '..'), { recursive: true })
  await writeFile(outputPath, html)
}

await rm(resolve(dist, 'server'), { recursive: true, force: true })
