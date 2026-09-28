/**
 * Horizontal overflow sweep.
 *
 * AGENTS.md is unambiguous that no page may scroll sideways at any width from
 * 320px up, and that the check has to be done in a real browser — a static
 * reading of the CSS cannot tell you what a long word, a wide table, or a grid
 * track actually resolves to after layout.
 *
 * Serves `dist/` and drives headless Chrome over the DevTools protocol, so it
 * needs no test dependencies. Reports the offending elements rather than just
 * the page, because "postwire overflows at 320" is not an actionable bug report.
 */
import { spawn } from 'node:child_process'
import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createServer } from 'node:http'
import { createReadStream, statSync } from 'node:fs'

const DIST = new URL('../dist/', import.meta.url).pathname
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const WIDTHS = [320, 375, 768, 1024]
let PORT = 0

if (!existsSync(DIST)) {
  console.error('dist/ is missing — run `npm run build` first')
  process.exit(1)
}
if (!existsSync(CHROME)) {
  console.error('Chrome not found; skipping the overflow sweep')
  process.exit(0)
}

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' }
const server = createServer((req, res) => {
  let path = join(DIST, decodeURIComponent(req.url.split('?')[0]))
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html')
  if (!existsSync(path)) {
    res.writeHead(404).end('not found')
    return
  }
  const ext = path.slice(path.lastIndexOf('.'))
  res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream' })
  createReadStream(path).pipe(res)
})

function pages(dir = DIST, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) pages(full, found)
    else if (entry.name === 'index.html') found.push(`/${full.slice(DIST.length).replace(/index\.html$/, '')}`)
  }
  return found
}

const PROBE = `(() => {
  const de = document.documentElement
  const vw = de.clientWidth
  if (de.scrollWidth <= vw + 1) return null
  // An element inside a scroll container is not causing the page to scroll —
  // it is doing exactly what a code block or a wide table is supposed to do.
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== de; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true
    }
    return false
  }
  const offenders = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.right <= vw + 1) continue
    if (clipped(el)) continue
    // Report the element itself, not every ancestor it also overflows.
    if (el.parentElement && el.parentElement.getBoundingClientRect().right > vw + 1) continue
    offenders.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '') + ' right=' + Math.round(r.right) + ' text=' + JSON.stringify((el.textContent || '').trim().slice(0, 40)))
    if (offenders.length >= 4) break
  }
  return { scrollWidth: de.scrollWidth, vw, offenders }
})()`

await new Promise((resolve, reject) => {
  // Not 8098: AGENTS.md documents that port for manual `dist/` inspection, and a
  // sweep should never fail because a preview server happens to be running.
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    PORT = server.address().port
    resolve()
  })
})

const chrome = spawn(CHROME, [
  '--headless=new', '--remote-debugging-port=9222', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check', '--user-data-dir=/tmp/oa-overflow-profile',
  'about:blank',
], { stdio: 'ignore' })

async function targetUrl() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list')
      const targets = await res.json()
      const page = targets.find((t) => t.type === 'page')
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('Chrome did not expose a debugging target')
}

const ws = new WebSocket(await targetUrl())
await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }))

let id = 0
const pending = new Map()
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data)
  const resolver = pending.get(msg.id)
  if (resolver) {
    pending.delete(msg.id)
    resolver(msg)
  }
})
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const messageId = ++id
    pending.set(messageId, (msg) => (msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)))
    ws.send(JSON.stringify({ id: messageId, method, params }))
  })

await send('Page.enable')
await send('Runtime.enable')

const failures = []
let checked = 0
for (const route of pages()) {
  for (const width of WIDTHS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width, height: 900, deviceScaleFactor: 1, mobile: width < 768,
    })
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${route}` })
    await new Promise((resolve) => {
      const onLoad = (event) => {
        if (JSON.parse(event.data).method === 'Page.loadEventFired') {
          ws.removeEventListener('message', onLoad)
          resolve()
        }
      }
      ws.addEventListener('message', onLoad)
      setTimeout(resolve, 5000)
    })
    const result = await send('Runtime.evaluate', { expression: PROBE, returnByValue: true })
    checked++
    if (result.result.value) {
      failures.push({ route, width, ...result.result.value })
    }
  }
}

ws.close()
chrome.kill()
server.close()

if (failures.length === 0) {
  console.log(`no horizontal overflow: ${checked} page/width combinations across ${pages().length} pages`)
} else {
  console.log(`${failures.length} of ${checked} page/width combinations overflow:\n`)
  for (const f of failures) {
    console.log(`  ${f.route} @ ${f.width}px — scrollWidth ${f.scrollWidth} vs ${f.vw}`)
    for (const offender of f.offenders) console.log(`      ${offender}`)
  }
  process.exitCode = 1
}
