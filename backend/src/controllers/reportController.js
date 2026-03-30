import * as employeeModel from '../models/employeeModel.js'

function getEmployeeStatus(employee) {
  const score = Number(employee.kpiScore ?? 0)

  if (score >= 85) {
    return 'Active'
  }

  if (score >= 60) {
    return 'Review'
  }

  return 'Needs Review'
}

function getReportFilterStatus(employee) {
  return getEmployeeStatus(employee) === 'Active' ? 'Active' : 'Inactive'
}

function matchesDateRange(employee, dateRange) {
  if (!dateRange || dateRange === 'all') {
    return true
  }

  const createdAt = new Date(employee.createdAt || 0)
  if (Number.isNaN(createdAt.getTime())) {
    return false
  }

  const now = new Date()
  const dayInMs = 24 * 60 * 60 * 1000

  if (dateRange === '7d') {
    return now - createdAt <= 7 * dayInMs
  }

  if (dateRange === '30d') {
    return now - createdAt <= 30 * dayInMs
  }

  if (dateRange === '90d') {
    return now - createdAt <= 90 * dayInMs
  }

  return true
}

async function getReports(req, res, next) {
  try {
    const allEmployees = await employeeModel.getEmployees()
    const { dateRange = 'all', department = 'all', status = 'all' } = req.query

    const employees = allEmployees.filter((employee) => {
      const matchesDepartment =
        department === 'all' ||
        (employee.department || 'General').toLowerCase() === String(department).toLowerCase()
      const matchesStatus =
        status === 'all' ||
        getReportFilterStatus(employee).toLowerCase() === String(status).toLowerCase()
      const matchesDate = matchesDateRange(employee, dateRange)

      return matchesDepartment && matchesStatus && matchesDate
    })

    const totalEmployees = employees.length
    const activeEmployees = employees.filter(
      (employee) => getEmployeeStatus(employee) === 'Active',
    ).length
    const reviewEmployees = employees.filter(
      (employee) => getEmployeeStatus(employee) === 'Review',
    ).length
    const needsReviewEmployees = employees.filter(
      (employee) => getEmployeeStatus(employee) === 'Needs Review',
    ).length
    const averagePerformance = totalEmployees
      ? Number(
          (
            employees.reduce(
              (sum, employee) => sum + Number(employee.kpiScore ?? 0),
              0,
            ) / totalEmployees
          ).toFixed(1),
        )
      : 0

    const departmentBreakdown = Object.entries(
      employees.reduce((accumulator, employee) => {
        const department = employee.department || 'General'
        accumulator[department] = (accumulator[department] || 0) + 1
        return accumulator
      }, {}),
    ).map(([department, count]) => ({
      department,
      count,
    }))

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalEmployees,
          activeEmployees,
          reviewEmployees,
          needsReviewEmployees,
          averagePerformance,
          filters: {
            dateRange,
            department,
            status,
          },
        },
        departmentBreakdown,
        employees,
      },
    })
  } catch (error) {
    next(error)
  }
}

export { getReports }
