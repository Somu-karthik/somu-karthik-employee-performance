const employeeKpis = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Ava Thompson',
    department: 'Engineering',
    kpiScore: 96,
    reviewDate: '2026-03-01',
    notes: 'Exceeded quarterly delivery goals',
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'Noah Patel',
    department: 'Product',
    kpiScore: 94,
    reviewDate: '2026-03-03',
    notes: 'Strong product execution and stakeholder alignment',
  },
]

function createKpiError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function validateKpiPayload(payload, { partial = false } = {}) {
  const {
    employeeId,
    employeeName,
    department,
    kpiScore,
    reviewDate,
  } = payload

  if (!partial) {
    if (
      employeeId === undefined ||
      !employeeName ||
      !department ||
      kpiScore === undefined ||
      !reviewDate
    ) {
      throw createKpiError(
        'Employee ID, employee name, department, KPI score, and review date are required',
        400,
      )
    }
  }

  if (employeeId !== undefined && (Number.isNaN(Number(employeeId)) || Number(employeeId) <= 0)) {
    throw createKpiError('Employee ID must be a valid positive number', 400)
  }

  if (employeeName !== undefined && !String(employeeName).trim()) {
    throw createKpiError('Employee name cannot be empty', 400)
  }

  if (department !== undefined && !String(department).trim()) {
    throw createKpiError('Department cannot be empty', 400)
  }

  if (kpiScore !== undefined) {
    const score = Number(kpiScore)
    if (Number.isNaN(score) || score < 0 || score > 100) {
      throw createKpiError('KPI score must be a number between 0 and 100', 400)
    }
  }

  if (reviewDate !== undefined && Number.isNaN(Date.parse(reviewDate))) {
    throw createKpiError('Review date must be a valid date', 400)
  }
}

async function getKpis() {
  return employeeKpis
}

async function getKpisByEmployeeId(employeeId) {
  const normalizedEmployeeId = Number(employeeId)

  if (Number.isNaN(normalizedEmployeeId) || normalizedEmployeeId <= 0) {
    throw createKpiError('Employee ID must be a valid positive number', 400)
  }

  return employeeKpis.filter((kpi) => kpi.employeeId === normalizedEmployeeId)
}

async function createKpi(payload) {
  validateKpiPayload(payload)

  const kpi = {
    id: employeeKpis.length + 1,
    employeeId: Number(payload.employeeId),
    employeeName: payload.employeeName.trim(),
    department: payload.department.trim(),
    kpiScore: Number(payload.kpiScore),
    reviewDate: payload.reviewDate,
    notes: payload.notes?.trim() || '',
  }

  employeeKpis.push(kpi)
  return kpi
}

async function updateKpi(id, payload) {
  validateKpiPayload(payload, { partial: true })

  const kpiIndex = employeeKpis.findIndex((kpi) => kpi.id === Number(id))

  if (kpiIndex === -1) {
    throw createKpiError('KPI record not found', 404)
  }

  employeeKpis[kpiIndex] = {
    ...employeeKpis[kpiIndex],
    ...Object.fromEntries(
      Object.entries(payload).map(([key, value]) => {
        if (key === 'employeeId' || key === 'kpiScore') {
          return [key, Number(value)]
        }

        if (typeof value === 'string') {
          return [key, value.trim()]
        }

        return [key, value]
      }),
    ),
  }

  return employeeKpis[kpiIndex]
}

export { getKpis, getKpisByEmployeeId, createKpi, updateKpi }
