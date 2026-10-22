import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer, request } from 'node:http'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'

const deliveries = []
let webhookStatus = 204
const receiver = createServer(async (req, res) => {
  let body = ''
  for await (const chunk of req) body += chunk
  deliveries.push(JSON.parse(body))
  res.writeHead(webhookStatus).end()
})
receiver.listen(0, '127.0.0.1')
await once(receiver, 'listening')

const servers = []
async function startApp(webhookUrl) {
  const reservation = createServer()
  reservation.listen(0, '127.0.0.1')
  await once(reservation, 'listening')
  const port = reservation.address().port
  await new Promise((resolve) => reservation.close(resolve))
  const child = spawn(process.execPath, ['.output/server/index.mjs'], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      HOST: '127.0.0.1',
      PORT: String(port),
      NITRO_HOST: '127.0.0.1',
      NITRO_PORT: String(port),
      NUXT_WEBHOOK_URL: webhookUrl,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  servers.push(child)
  let output = ''
  child.stdout.on('data', (chunk) => { output += chunk })
  child.stderr.on('data', (chunk) => { output += chunk })
  const url = `http://127.0.0.1:${port}`
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`Server exited. ${output}`)
    try {
      if ((await fetch(url)).ok) return url
    } catch {}
    await delay(100)
  }
  throw new Error(`Server failed to start. ${output}`)
}

const valid = { name: ' Visitor ', email: ' visitor@example.com ', message: ' Hello John. ', website: '' }
const post = (base, body, headers = {}) => fetch(`${base}/api/contact`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body),
})

try {
  const base = await startApp(`http://127.0.0.1:${receiver.address().port}/webhook`)
  const response = await post(base, valid)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(deliveries.length, 1)
  assert.deepEqual(deliveries[0].allowed_mentions, { parse: [] })
  assert.deepEqual(deliveries[0].embeds[0].fields, [
    { name: 'Name', value: 'Visitor' },
    { name: 'Email', value: 'visitor@example.com' },
    { name: 'Message', value: 'Hello John.' },
  ])
  assert.equal(response.headers.get('cache-control'), 'no-store')
  console.log('PASS valid submission delivers trimmed fields once without echoing personal data')

  for (const body of [null, [], {}, { ...valid, name: {} }, { ...valid, name: '  ' },
    { ...valid, email: 'invalid' }, { ...valid, message: [] }, { ...valid, message: ' ' },
    { ...valid, name: 'x'.repeat(101) }, { ...valid, email: `${'x'.repeat(250)}@example.com` },
    { ...valid, message: 'x'.repeat(1025) }, { ...valid, website: undefined }]) {
    assert.equal((await post(base, body)).status, 400)
  }
  assert.equal(deliveries.length, 1)
  console.log('PASS invalid types, blank values, missing honeypot and oversized fields are rejected')

  const trapped = await post(base, { ...valid, website: 'https://spam.example' })
  assert.equal(trapped.status, 200)
  assert.deepEqual(await trapped.json(), { ok: true })
  assert.equal(deliveries.length, 1)
  assert.equal((await post(base, valid, { 'sec-fetch-site': 'cross-site' })).status, 403)
  assert.equal((await post(base, valid, { 'content-type': 'text/plain' })).status, 415)
  const malformed = await fetch(`${base}/api/contact`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{invalid',
  })
  assert.equal(malformed.status, 400)
  assert.equal((await post(base, { ...valid, message: 'x'.repeat(20000) })).status, 413)
  console.log('PASS honeypot, cross-site form, wrong content type, malformed JSON and body size checks')

  const chunkedStatus = await new Promise((resolve, reject) => {
    const req = request(`${base}/api/contact`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'transfer-encoding': 'chunked' },
    }, (res) => { res.resume(); resolve(res.statusCode) })
    req.on('error', reject)
    req.setTimeout(5000, () => req.destroy(new Error('Chunked request timed out')))
    req.write('{"message":"')
    void delay(20).then(() => req.write('x'.repeat(20000)))
    void delay(40).then(() => req.end('"}'))
  })
  assert.equal(chunkedStatus, 413)
  assert.equal(deliveries.length, 1)
  await delay(60)
  assert.equal((await fetch(base)).status, 200)
  console.log('PASS oversized chunked request is rejected without webhook delivery')

  const boundary = await post(base, { ...valid, name: 'x'.repeat(100), message: 'x'.repeat(1024) })
  assert.equal(boundary.status, 200)
  assert.equal(deliveries.length, 2)
  webhookStatus = 500
  const failed = await post(base, valid)
  assert.equal(failed.status, 502)
  const failedText = await failed.text()
  assert.equal(failedText.includes('/webhook'), false)
  assert.equal(failedText.includes('visitor@example.com'), false)
  assert.equal(deliveries.length, 3)
  webhookStatus = 204
  assert.equal((await post(base, valid)).status, 200)
  assert.equal(deliveries.length, 4)
  console.log('PASS length boundary, generic upstream error, no automatic retry, and recovery')

  const unconfigured = await startApp('')
  assert.equal((await post(unconfigured, valid)).status, 503)
  assert.equal(deliveries.length, 4)
  for (const path of ['/', '/about', '/projects', '/contact', '/about-contact']) {
    const page = await fetch(`${base}${path}`)
    assert.equal(page.status, 200, path)
    assert.equal(page.headers.get('x-content-type-options'), 'nosniff')
    assert.equal(page.headers.get('x-frame-options'), 'DENY')
    const html = await page.text()
    if (path.includes('contact')) assert.match(html, /name="website"/)
    if (path === '/projects') assert.match(html, /Filter Fetch/)
  }
  const image = await fetch(`${base}/_ipx/w_64/me.png`)
  assert.equal(image.status, 200)
  assert.match(image.headers.get('content-type'), /^image\//)
  console.log('PASS missing webhook, all pages, security headers, both form fields, project content and image processing')
} finally {
  for (const child of servers) child.kill('SIGTERM')
  receiver.closeAllConnections()
  await new Promise((resolve) => receiver.close(resolve))
}
