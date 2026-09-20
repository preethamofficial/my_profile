/**
 * Downscale + re-encode an uploaded image in the browser before it is stored.
 * Keeps the published settings file small: the GitHub Contents API rejects
 * payloads much above 1 MB, and localStorage is capped at a few MB.
 */
const MAX_DATA_URL_LENGTH = 700_000

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('read failed'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('decode failed'))
    image.src = src
  })
}

export async function optimizeImageFile(file: File, maxWidth = 1920, quality = 0.82): Promise<string> {
  const original = await readAsDataUrl(file)
  try {
    const image = await loadImage(original)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return original

    const scale = Math.min(1, maxWidth / image.width)
    if (scale === 1 && file.size < 350 * 1024) return original

    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Step quality down until the result is small enough to publish comfortably.
    let best = canvas.toDataURL('image/webp', quality)
    for (const step of [0.7, 0.6, 0.5, 0.4]) {
      if (best.length <= MAX_DATA_URL_LENGTH) break
      best = canvas.toDataURL('image/webp', step)
    }

    // Still too big? Shrink the dimensions as a last resort.
    let width = canvas.width
    while (best.length > MAX_DATA_URL_LENGTH && width > 640) {
      width = Math.round(width * 0.75)
      canvas.width = width
      canvas.height = Math.max(1, Math.round((image.height / image.width) * width))
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      best = canvas.toDataURL('image/webp', 0.6)
    }

    if (best.startsWith('data:image/webp')) return best
    return canvas.toDataURL('image/jpeg', 0.7)
  } catch {
    return original
  }
}
