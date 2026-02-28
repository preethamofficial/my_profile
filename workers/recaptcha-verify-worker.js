export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { 'content-type': 'application/json' },
      })
    }

    const allowedOrigin = env.ALLOWED_ORIGIN
    const requestOrigin = request.headers.get('origin') ?? ''
    if (!allowedOrigin || requestOrigin !== allowedOrigin) {
      return new Response(JSON.stringify({ success: false, error: 'Origin not allowed' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      })
    }

    const body = await request.json().catch(() => null)
    const token = body?.token
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Missing token' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    const verifyParams = new URLSearchParams()
    verifyParams.append('secret', env.RECAPTCHA_SECRET_KEY)
    verifyParams.append('response', token)

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: verifyParams.toString(),
    })

    const result = await response.json()
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': allowedOrigin,
      },
    })
  },
}
