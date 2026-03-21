import apiClient from './apiClient'

export async function getReports(params = {}) {
  const { data } = await apiClient.get('/reports', { params })
  return data
}
