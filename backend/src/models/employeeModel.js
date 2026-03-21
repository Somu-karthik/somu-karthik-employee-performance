const mockEmployees = [
  {
    id: 1,
    name: 'Ava Thompson',
    email: 'ava.thompson@company.com',
    position: 'Senior Engineer',
    role: 'Senior Engineer',
    department: 'Engineering',
    performance: 96,
    kpiScore: 96,
    createdAt: '2026-03-18T09:00:00.000Z',
  },
  {
    id: 2,
    name: 'Noah Patel',
    email: 'noah.patel@company.com',
    position: 'Product Manager',
    role: 'Product Manager',
    department: 'Product',
    performance: 94,
    kpiScore: 94,
    createdAt: '2026-03-10T09:00:00.000Z',
  },
]

function createEmployeeError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateEmployeePayload(payload, { partial = false } = {}) {
  const {
    name,
    email,
    position,
    role,
    department,
    performance,
    kpiScore,
  } = payload
  const resolvedPosition = position ?? role
  const resolvedPerformance = performance ?? kpiScore

  if (!partial) {
    if (!name || !email || !resolvedPosition) {
      throw createEmployeeError(
        'Name, email, and position are required',
        400,
      )
    }
  }

  if (name !== undefined && !String(name).trim()) {
    throw createEmployeeError('Name cannot be empty', 400)
  }

  if (email !== undefined && !String(email).trim()) {
    throw createEmployeeError('Email cannot be empty', 400)
  }

  if (email !== undefined && String(email).trim() && !validateEmail(String(email).trim())) {
    throw createEmployeeError('Please provide a valid email address', 400)
  }

  if (resolvedPosition !== undefined && !String(resolvedPosition).trim()) {
    throw createEmployeeError('Position cannot be empty', 400)
  }

  if (role !== undefined && !String(role).trim()) {
    throw createEmployeeError('Role cannot be empty', 400)
  }

  if (department !== undefined && !String(department).trim()) {
    throw createEmployeeError('Department cannot be empty', 400)
  }

  if (resolvedPerformance !== undefined) {
    const score = Number(resolvedPerformance)
    if (Number.isNaN(score) || score < 0 || score > 100) {
      throw createEmployeeError('Performance must be an integer between 0 and 100', 400)
    }

    if (!Number.isInteger(score)) {
      throw createEmployeeError('Performance must be an integer between 0 and 100', 400)
    }
  }
}

async function getEmployees() {
  return mockEmployees
}

async function addEmployee(payload) {
  validateEmployeePayload(payload)

  const normalizedPosition = payload.position?.trim() || payload.role.trim()
  const employee = {
    id: mockEmployees.length + 1,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    position: normalizedPosition,
    role: normalizedPosition,
    department: payload.department?.trim() || 'General',
    performance: Number(payload.performance ?? payload.kpiScore ?? 0),
    kpiScore: Number(payload.performance ?? payload.kpiScore ?? 0),
    createdAt: new Date().toISOString(),
  }

  mockEmployees.push(employee)
  return employee
}

async function updateEmployee(id, payload) {
  validateEmployeePayload(payload, { partial: true })

  const employeeIndex = mockEmployees.findIndex(
    (employee) => employee.id === Number(id),
  )

  if (employeeIndex === -1) {
    throw createEmployeeError('Employee not found', 404)
  }

  mockEmployees[employeeIndex] = {
    ...mockEmployees[employeeIndex],
    ...Object.fromEntries(
      Object.entries(payload).map(([key, value]) => {
        if (key === 'kpiScore' || key === 'performance') {
          return [key, Number(value)]
        }

        if (typeof value === 'string') {
          return [key, value.trim()]
        }

        return [key, value]
      }),
    ),
  }

  if (payload.position !== undefined) {
    mockEmployees[employeeIndex].position = payload.position.trim()
    mockEmployees[employeeIndex].role = payload.position.trim()
  }

  if (payload.role !== undefined && payload.position === undefined) {
    mockEmployees[employeeIndex].position = payload.role.trim()
  }

  if (payload.email !== undefined) {
    mockEmployees[employeeIndex].email = payload.email.trim().toLowerCase()
  }

  if (payload.performance !== undefined) {
    mockEmployees[employeeIndex].performance = Number(payload.performance)
    mockEmployees[employeeIndex].kpiScore = Number(payload.performance)
  }

  if (payload.kpiScore !== undefined && payload.performance === undefined) {
    mockEmployees[employeeIndex].performance = Number(payload.kpiScore)
  }

  return mockEmployees[employeeIndex]
}

async function deleteEmployee(id) {
  const employeeIndex = mockEmployees.findIndex(
    (employee) => employee.id === Number(id),
  )

  if (employeeIndex === -1) {
    throw createEmployeeError('Employee not found', 404)
  }

  const [deletedEmployee] = mockEmployees.splice(employeeIndex, 1)
  return deletedEmployee
}

module.exports = {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
}
