import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = resolve(root, 'dist')
const templatePath = resolve(dist, 'index.html')
const serverEntry = resolve(dist, 'server/entry-server.js')

const template = await readFile(templatePath, 'utf8')
const { render } = await import(pathToFileURL(serverEntry).href)
const appHtml = render('/')

const html = template.replace(
  '<div id="root"><!--app-html--></div>',
  `<div id="root" data-prerendered="true">${appHtml}</div>`
)

await writeFile(templatePath, html)
await rm(resolve(dist, 'server'), { recursive: true, force: true })
