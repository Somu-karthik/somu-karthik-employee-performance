import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  getReports,
  isAdminUser,
  updateEmployee,
} from '../services'

const departmentPalette = ['#2563eb', '#0ea5e9', '#7c3aed', '#16a34a', '#f97316', '#e11d48']

const defaultForm = {
  name: '',
  email: '',
  position: '',
  performance: '',
}

const reportDateRanges = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
]

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

function getStatusClasses(status) {
  const statusClasses = {
    Active: 'bg-green-50 text-green-700 border border-green-100',
    Review: 'bg-amber-50 text-amber-700 border border-amber-100',
    'Needs Review': 'bg-rose-50 text-rose-700 border border-rose-100',
  }

  return statusClasses[status] ?? 'bg-slate-100 text-slate-700 border border-slate-200'
}

function getPerformanceBarColor(value) {
  if (value > 80) {
    return '#16a34a'
  }

  if (value >= 50) {
    return '#2563eb'
  }

  return '#dc2626'
}

function downloadCsvReport(reportSummary) {
  if (!reportSummary) {
    return false
  }

  const summaryRows = [
    ['Metric', 'Value'],
    ['Total Employees', reportSummary.summary?.totalEmployees ?? 0],
    ['Active Employees', reportSummary.summary?.activeEmployees ?? 0],
    ['Employees In Review', reportSummary.summary?.reviewEmployees ?? 0],
    ['Needs Review', reportSummary.summary?.needsReviewEmployees ?? 0],
    ['Average Performance', `${reportSummary.summary?.averagePerformance ?? 0}%`],
    [''],
    ['Department', 'Count'],
    ...(reportSummary.departmentBreakdown ?? []).map((item) => [
      item.department,
      item.count,
    ]),
  ]

  const csvContent = summaryRows
    .map((row) =>
      row.map((value = '') => `"${String(value).replace(/"/g, '""')}"`).join(','),
    )
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const timestamp = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `employee-report-summary-${timestamp}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return true
}

function DashboardPage() {
  const canDeleteEmployees = isAdminUser()
  const [employees, setEmployees] = useState([])
  const [formValues, setFormValues] = useState(defaultForm)
  const [editingEmployeeId, setEditingEmployeeId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const [reportMessage, setReportMessage] = useState('')
  const [isReportLoading, setIsReportLoading] = useState(false)
  const [isDownloadingReport, setIsDownloadingReport] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportSummary, setReportSummary] = useState(null)
  const [reportFilters, setReportFilters] = useState({
    dateRange: 'all',
    department: 'all',
    status: 'all',
  })

  const loadEmployees = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await getEmployees()
      setEmployees(response.data ?? response ?? [])
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Failed to load employees.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const overviewStats = useMemo(() => {
    const totalEmployees = employees.length
    const activeEmployees = employees.filter(
      (employee) => getEmployeeStatus(employee) === 'Active',
    ).length
    const averagePerformance = totalEmployees
      ? Math.round(
          employees.reduce((sum, employee) => sum + Number(employee.kpiScore ?? 0), 0) /
            totalEmployees,
        )
      : 0
    const tasksCompleted = totalEmployees
      ? employees.reduce((sum, employee) => sum + Math.max(6, Math.round(Number(employee.kpiScore ?? 0) / 8)), 0)
      : 0

    return [
      {
        label: 'Total Employees',
        value: String(totalEmployees).padStart(2, '0'),
        change: totalEmployees ? 'Team directory live' : 'Add your first employee',
        tone: 'blue',
        icon: 'employees',
      },
      {
        label: 'Active Employees',
        value: String(activeEmployees).padStart(2, '0'),
        change: totalEmployees ? `${Math.round((activeEmployees / totalEmployees) * 100)}% of team` : 'No activity yet',
        tone: 'green',
        icon: 'activity',
      },
      {
        label: 'Performance %',
        value: `${averagePerformance}%`,
        change: averagePerformance >= 85 ? 'Healthy momentum' : 'Needs follow-up',
        tone: 'purple',
        icon: 'trend',
      },
      {
        label: 'Tasks Completed',
        value: String(tasksCompleted),
        change: 'Estimated this cycle',
        tone: 'orange',
        icon: 'check',
      },
    ]
  }, [employees])

  const performanceData = useMemo(
    () =>
      employees.slice(0, 6).map((employee) => ({
        name: employee.name,
        value: Number(employee.performance ?? employee.kpiScore ?? 0),
      })),
    [employees],
  )

  const departmentData = useMemo(() => {
    const counts = employees.reduce((accumulator, employee) => {
      const department = employee.department || 'General'
      accumulator[department] = (accumulator[department] || 0) + 1
      return accumulator
    }, {})

    return Object.entries(counts).map(([name, value], index) => ({
      name,
      value,
      fill: departmentPalette[index % departmentPalette.length],
    }))
  }, [employees])

  const notifications = useMemo(() => {
    const lowScoreEmployees = employees.filter((employee) => Number(employee.kpiScore ?? 0) < 70).length

    return [
      {
        title: 'Performance review window',
        description: 'Managers should complete monthly reviews before Friday at 5 PM.',
      },
      {
        title: 'Employees needing attention',
        description: `${lowScoreEmployees} employee${lowScoreEmployees === 1 ? '' : 's'} currently need a follow-up plan.`,
      },
      {
        title: 'Hiring pipeline sync',
        description: 'Keep position titles aligned before importing the next batch of employee records.',
      },
    ]
  }, [employees])

  const reportDepartmentOptions = useMemo(() => {
    const departments = Array.from(
      new Set(employees.map((employee) => employee.department || 'General')),
    )

    return ['all', ...departments]
  }, [employees])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  const handleReportFilterChange = (event) => {
    const { name, value } = event.target
    setReportFilters((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => {
    setFormValues(defaultForm)
    setEditingEmployeeId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitMessage('')

    if (!formValues.name.trim() || !formValues.email.trim() || !formValues.position.trim()) {
      setSubmitMessage('Name, email, and position are required.')
      return
    }

    if (
      formValues.performance !== '' &&
      (Number.isNaN(Number(formValues.performance)) ||
        Number(formValues.performance) < 0 ||
        Number(formValues.performance) > 100)
    ) {
      setSubmitMessage('Performance must be a number between 0 and 100.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        position: formValues.position.trim(),
        kpiScore:
          formValues.performance === '' ? 0 : Number(formValues.performance),
      }

      if (editingEmployeeId) {
        await updateEmployee(editingEmployeeId, payload)
        setSubmitMessage('Employee updated successfully.')
      } else {
        await addEmployee(payload)
        setSubmitMessage('Employee added successfully.')
      }

      resetForm()
      await loadEmployees()
    } catch (submitError) {
      setSubmitMessage(
        submitError.response?.data?.message || 'Unable to save employee right now.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployeeId(employee.id)
    setFormValues({
      name: employee.name ?? '',
      email: employee.email ?? '',
      position: employee.position ?? employee.role ?? '',
      performance: String(employee.kpiScore ?? ''),
    })
    setSubmitMessage('')
  }

  const handleDelete = async (employeeId) => {
    setSubmitMessage('')
    setIsSubmitting(true)

    try {
      await deleteEmployee(employeeId)
      setSubmitMessage('Employee removed successfully.')

      if (editingEmployeeId === employeeId) {
        resetForm()
      }

      await loadEmployees()
    } catch (deleteError) {
      setSubmitMessage(
        deleteError.response?.data?.message || 'Unable to delete employee right now.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateReport = async () => {
    setReportMessage('')
    setIsReportLoading(true)

    try {
      const response = await getReports(reportFilters)
      setReportSummary(response.data ?? null)
      setIsReportModalOpen(true)
    } catch (reportError) {
      setReportMessage(
        reportError.response?.data?.message || 'Unable to generate report right now.',
      )
    } finally {
      setIsReportLoading(false)
    }
  }

  const handleDownloadReport = () => {
    setReportMessage('')
    setIsDownloadingReport(true)

    try {
      const didDownload = downloadCsvReport(reportSummary)
      setReportMessage(
        didDownload
          ? 'Report downloaded successfully.'
          : 'No report data available to download.',
      )
    } finally {
      setIsDownloadingReport(false)
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Admin Overview
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Manage employee performance from one clear dashboard.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Track employee records, review performance trends, monitor department mix,
                and act on alerts without leaving the workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={isReportLoading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-blue-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isReportLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v10" strokeLinecap="round" />
                  <path d="m8 9 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 19h14" strokeLinecap="round" />
                </svg>
              )}
              {isReportLoading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          {reportMessage ? (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {reportMessage}
            </div>
          ) : null}

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Date Range
              </span>
              <select
                name="dateRange"
                value={reportFilters.dateRange}
                onChange={handleReportFilterChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                {reportDateRanges.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Department
              </span>
              <select
                name="department"
                value={reportFilters.department}
                onChange={handleReportFilterChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                {reportDepartmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Departments' : option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Status
              </span>
              <select
                name="status"
                value={reportFilters.status}
                onChange={handleReportFilterChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadEmployees}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-slate-800 hover:shadow-lg"
            >
              Refresh data
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:scale-105 hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
            >
              New employee
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            Notifications
          </p>
          <div className="mt-5 space-y-3">
            {notifications.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:scale-[1.02] hover:shadow-md"
              >
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {overviewStats.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <ChartCard
          title="Performance overview"
          subtitle="Bar chart showing employee performance scores for the current cycle."
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  radius={[12, 12, 0, 0]}
                  isAnimationActive
                  animationDuration={900}
                >
                  {performanceData.map((entry) => (
                    <Cell key={entry.name} fill={getPerformanceBarColor(entry.value)} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill="#0f172a"
                    fontSize={12}
                    fontWeight={700}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Employee distribution"
          subtitle="Pie chart showing how employees are distributed across departments."
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {departmentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {departmentData.map((item) => (
              <div key={item.name} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-sm font-medium text-slate-700">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)]">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Employee Table</h3>
              <p className="mt-1 text-sm text-slate-600">
                Review employee details, status, and quick actions.
              </p>
            </div>
            <button
              type="button"
              onClick={loadEmployees}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:scale-105 hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-3 px-6 py-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : error ? (
              <div className="px-6 py-8">
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                  <p className="text-sm font-semibold text-rose-700">{error}</p>
                  <button
                    type="button"
                    onClick={loadEmployees}
                    className="mt-3 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-rose-500"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : employees.length === 0 ? (
              <div className="px-6 py-8 text-sm text-slate-500">No employees found.</div>
            ) : (
              <table className="min-w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Position</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => {
                    const status = getEmployeeStatus(employee)

                    return (
                      <tr key={employee.id} className="border-t border-slate-200 text-sm text-slate-700">
                        <td className="px-6 py-4 font-semibold text-slate-900">{employee.name}</td>
                        <td className="px-6 py-4">{employee.email}</td>
                        <td className="px-6 py-4">{employee.position ?? employee.role}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(employee)}
                              className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:scale-105 hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            {canDeleteEmployees ? (
                              <button
                                type="button"
                                onClick={() => handleDelete(employee.id)}
                                disabled={isSubmitting}
                                className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:scale-105 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            Add Employee
          </p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            {editingEmployeeId ? 'Update employee details' : 'Create a new employee record'}
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Add team members with the core information required for performance tracking.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Enter employee name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Enter employee email"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Position</span>
              <input
                type="text"
                name="position"
                value={formValues.position}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Enter employee position"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Performance</span>
              <input
                type="number"
                name="performance"
                min="0"
                max="100"
                value={formValues.performance}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Enter performance score (0-100)"
              />
            </label>

            {submitMessage ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {submitMessage}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-blue-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? editingEmployeeId
                    ? 'Updating...'
                    : 'Adding...'
                  : editingEmployeeId
                    ? 'Update employee'
                    : 'Add employee'}
              </button>
              {editingEmployeeId && canDeleteEmployees ? (
                <button
                  type="button"
                  onClick={() => handleDelete(editingEmployeeId)}
                  disabled={isSubmitting}
                  className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:scale-105 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Delete employee
                </button>
              ) : null}

              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:scale-105 hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>

      {isReportModalOpen && reportSummary ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                  Report Summary
                </p>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                  Employee performance snapshot
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Live summary generated from the current employee report endpoint.
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={handleDownloadReport}
                  disabled={isDownloadingReport}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-blue-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDownloadingReport ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3v10" strokeLinecap="round" />
                      <path d="m8 9 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 19h14" strokeLinecap="round" />
                    </svg>
                  )}
                  {isDownloadingReport ? 'Downloading...' : 'Download Report'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:scale-105 hover:shadow-md"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                  Total Employees
                </p>
                <p className="mt-3 text-3xl font-extrabold text-slate-900">
                  {reportSummary.summary?.totalEmployees ?? 0}
                </p>
              </div>
              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
                  Active Employees
                </p>
                <p className="mt-3 text-3xl font-extrabold text-slate-900">
                  {reportSummary.summary?.activeEmployees ?? 0}
                </p>
              </div>
              <div className="rounded-2xl bg-purple-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-700">
                  Performance
                </p>
                <p className="mt-3 text-3xl font-extrabold text-slate-900">
                  {reportSummary.summary?.averagePerformance ?? 0}%
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Employees In Review</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {reportSummary.summary?.reviewEmployees ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Needs Review</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {reportSummary.summary?.needsReviewEmployees ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">Applied Filters</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-white px-3 py-1">
                  Date: {reportSummary.summary?.filters?.dateRange ?? 'all'}
                </span>
                <span className="rounded-full bg-white px-3 py-1">
                  Department: {reportSummary.summary?.filters?.department ?? 'all'}
                </span>
                <span className="rounded-full bg-white px-3 py-1">
                  Status: {reportSummary.summary?.filters?.status ?? 'all'}
                </span>
              </div>
            </div>

            {reportMessage ? (
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {reportMessage}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DashboardPage
