import { getRequestWebStream } from 'h3'
import { contactSchema } from '../../shared/contact'

export default defineEventHandler(async (event) => {
  if (getHeader(event, 'sec-fetch-site') === 'cross-site') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Request not allowed.',
    })
  }

  const contentType = getHeader(event, 'content-type')
    ?.split(';')[0]
    ?.trim()
    .toLowerCase()
  if (contentType !== 'application/json') {
    throw createError({ statusCode: 415, statusMessage: 'JSON required.' })
  }

  const maxBytes = 16 * 1024
  if (Number(getHeader(event, 'content-length')) > maxBytes) {
    throw createError({ statusCode: 413, statusMessage: 'Request too large.' })
  }

  const reader = getRequestWebStream(event)!.getReader()
  const chunks: Uint8Array[] = []
  let size = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) {
        if (event.web?.request) {
          void reader.cancel().catch(() => {})
        } else {
          // h3's Node stream adapter cannot safely cancel while data is arriving.
          event.node.req.pause()
          setHeader(event, 'connection', 'close')
          event.node.res.once('finish', () => event.node.req.destroy())
        }
        throw createError({
          statusCode: 413,
          statusMessage: 'Request too large.',
        })
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  let body: unknown
  try {
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) {
      bytes.set(chunk, offset)
      offset += chunk.byteLength
    }
    body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid contact submission.',
    })
  }

  const result = contactSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid contact submission.',
    })
  }

  const { name, email, message, website } = result.data
  if (website) return { ok: true }

  const { webhookUrl } = useRuntimeConfig(event)
  if (!webhookUrl) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Contact form unavailable.',
    })
  }

  try {
    await $fetch(webhookUrl, {
      method: 'POST',
      timeout: 10000,
      retry: 0,
      body: {
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: 'Contact Form Submitted',
            fields: [
              { name: 'Name', value: name },
              { name: 'Email', value: email },
              { name: 'Message', value: message },
            ],
          },
        ],
      },
    })
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to send your message.',
    })
  }

  return { ok: true }
})
