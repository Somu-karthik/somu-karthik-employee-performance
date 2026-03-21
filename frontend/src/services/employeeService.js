import apiClient from './apiClient'

export async function getEmployees(params = {}) {
  const { data } = await apiClient.get('/employees', { params })
  return data
}

export async function addEmployee(payload) {
  const { data } = await apiClient.post('/employees', payload)
  return data
}

export async function updateEmployee(employeeId, payload) {
  const { data } = await apiClient.put(`/employees/${employeeId}`, payload)
  return data
}

export async function deleteEmployee(employeeId) {
  const { data } = await apiClient.delete(`/employees/${employeeId}`)
  return data
}
