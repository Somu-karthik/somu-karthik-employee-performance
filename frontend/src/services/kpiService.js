import apiClient from './apiClient'

export async function getKpis(params = {}) {
  const { data } = await apiClient.get('/kpi', { params })
  return data
}
