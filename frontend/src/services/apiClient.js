import axios from 'axios'
import { getToken, removeToken } from './tokenService'

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '')
const baseURL = configuredApiUrl ? `${configuredApiUrl}/api` : '/api'

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

function isPublicRequest(url = '') {
  return (
    url.startsWith('/auth/login') ||
    url.startsWith('/auth/register') ||
    url.startsWith('/health')
  )
}

API.interceptors.request.use((req) => {
  const token = getToken()
  const requestUrl = req.url || ''

  if (!token && !isPublicRequest(requestUrl)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }

    return Promise.reject(new Error('Authentication token not found'))
  }

  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }

  return req
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status

    if (statusCode === 401) {
      removeToken()

      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default API
