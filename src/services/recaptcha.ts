interface RecaptchaVerifyResponse {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

export async function verifyRecaptchaToken(token: string, endpoint: string): Promise<RecaptchaVerifyResponse> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })

  if (!response.ok) {
    throw new Error(`reCAPTCHA verify endpoint failed with status ${response.status}`)
  }

  return (await response.json()) as RecaptchaVerifyResponse
}
