import apiClient from './apiClient'
import { removeToken, setToken } from './tokenService'

function buildApiUrl(path) {
  const baseUrl = apiClient.defaults.baseURL || ''
  return `${baseUrl}${path}`
}

export async function login(payload) {
  const endpoint = '/auth/login'
  const requestBody = {
    email: payload?.email?.trim(),
    password: payload?.password ?? '',
  }

  try {
    console.log('Sending POST request:', {
      url: buildApiUrl(endpoint),
      payload: requestBody,
    })

    const { data } = await apiClient.post(endpoint, requestBody)

    console.log('Login response:', data)

    if (!data?.token) {
      throw new Error('Login completed but no access token was returned.')
    }

    setToken(data.token)
    return data
  } catch (error) {
    removeToken()
    throw error
  }
}
//This is a comment
export async function register(payload) {
  const endpoint = '/auth/register'

  console.log('Sending POST request:', {
    url: buildApiUrl(endpoint),
    payload,
  })

  const { data } = await apiClient.post(endpoint, payload)

  console.log('Register response:', data)

  if (data?.token) {
    setToken(data.token)
  }

  return data
}
//hello
export function logout() {
  removeToken()
}
