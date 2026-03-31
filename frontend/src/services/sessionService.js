import { getToken } from './tokenService'

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = (4 - (normalized.length % 4)) % 4
  const padded = `${normalized}${'='.repeat(padding)}`

  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(padded)
  }

  return ''
}

export function getCurrentUser() {
  const token = getToken()

  if (!token) {
    return null
  }

  try {
    const [, payload = ''] = token.split('.')

    if (!payload) {
      return null
    }

    return JSON.parse(decodeBase64Url(payload))
  } catch {
    return null
  }
}

export function isAdminUser() {
  return getCurrentUser()?.role === 'Admin'
}
