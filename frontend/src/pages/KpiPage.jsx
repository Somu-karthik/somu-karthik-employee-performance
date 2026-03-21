import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from '../components/ChartCard'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { getKpis } from '../services'

const dateRanges = [
  { label: 'All time', value: 'all' },
  { label: 'This month', value: 'month' },
  { label: 'This quarter', value: 'quarter' },
  { label: 'This year', value: 'year' },
]

function KpiPage() {
  const [selectedDateRange, setSelectedDateRange] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [kpiRecords, setKpiRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadKpis() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getKpis()
        setKpiRecords(response.data ?? [])
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load KPI data right now.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadKpis()
  }, [])

  const normalizedRecords = useMemo(
    () =>
      kpiRecords.map((record) => ({
        id: record.id,
        employeeId: record.employeeId,
        employeeName: record.employeeName || `Employee #${record.employeeId}`,
        department: record.department || 'General',
        score: Number(record.kpiScore ?? record.score ?? 0),
        reviewDate: record.reviewDate ?? record.date,
        notes: record.notes || 'Performance record captured for this review period.',
      })),
    [kpiRecords],
  )

  const departmentOptions = useMemo(() => {
    const departments = new Set(normalizedRecords.map((record) => record.department))
    return ['All Departments', ...departments]
  }, [normalizedRecords])

  const matchesDateRange = (dateValue, range) => {
    if (range === 'all') {
      return true
    }

    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) {
      return false
    }

    const now = new Date()

    if (range === 'month') {
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      )
    }

    if (range === 'quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3)
      const recordQuarter = Math.floor(date.getMonth() / 3)

      return (
        date.getFullYear() === now.getFullYear() &&
        recordQuarter === currentQuarter
      )
    }

    if (range === 'year') {
      return date.getFullYear() === now.getFullYear()
    }

    return true
  }

  const filteredRecords = useMemo(() => {
    return normalizedRecords.filter((record) => {
      const matchesDate = matchesDateRange(record.reviewDate, selectedDateRange)
      const matchesDepartment =
        selectedDepartment === 'All Departments' ||
        record.department === selectedDepartment

      return matchesDate && matchesDepartment
    })
  }, [normalizedRecords, selectedDateRange, selectedDepartment])

  const kpiCards = useMemo(() => {
    const totalRecords = filteredRecords.length
    const averageScore =
      totalRecords > 0
        ? (
            filteredRecords.reduce((sum, record) => sum + record.score, 0) /
            totalRecords
          ).toFixed(1)
        : '0.0'
    const topScore =
      totalRecords > 0 ? Math.max(...filteredRecords.map((record) => record.score)) : 0

    return [
      {
        label: 'Tracked employees',
        value: String(totalRecords),
        change: selectedDepartment === 'All Departments' ? 'All teams' : selectedDepartment,
        tone: 'default',
      },
      {
        label: 'Average KPI score',
        value: `${averageScore}%`,
        change: 'Current filter set',
        tone: 'positive',
      },
      {
        label: 'Top KPI score',
        value: String(topScore),
        change: 'Best performer',
        tone: 'positive',
      },
    ]
  }, [filteredRecords, selectedDepartment])

  const performanceData = useMemo(
    () =>
      filteredRecords.map((record) => ({
        name: record.employeeName,
        score: record.score,
      })),
    [filteredRecords],
  )

  const departmentData = useMemo(() => {
    const grouped = filteredRecords.reduce((accumulator, record) => {
      accumulator[record.department] =
        accumulator[record.department] || { department: record.department, score: 0, count: 0 }
      accumulator[record.department].score += record.score
      accumulator[record.department].count += 1
      return accumulator
    }, {})

    return Object.values(grouped).map((entry) => ({
      department: entry.department,
      score: Number((entry.score / entry.count).toFixed(1)),
    }))
  }, [filteredRecords])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Measurement"
        title="KPI dashboard"
        description="Track employee KPI health with filters, charts, and department-level performance visibility."
        action="Create KPI"
      />

      <section className="surface-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Filters</h3>
            <p className="mt-1 text-sm text-slate-500">
              Narrow the KPI view by reporting window and department.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="dateRange"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Date range
              </label>
              <select
                id="dateRange"
                value={selectedDateRange}
                onChange={(event) => setSelectedDateRange(event.target.value)}
                className="input-surface w-full px-4 py-3 text-sm"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(event) => setSelectedDepartment(event.target.value)}
                className="input-surface w-full px-4 py-3 text-sm"
              >
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpiCards.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <ChartCard
          title="Performance trend"
          subtitle="KPI score by employee across the selected filter set."
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Department performance"
          subtitle="Average KPI score distribution for the selected department filter."
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="score" fill="#2563eb" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <div className="surface-card rounded-[2rem] border-dashed p-10 text-center text-sm text-slate-500 xl:col-span-3">
            Loading KPI data...
          </div>
        ) : filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="surface-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
                    {record.department}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {record.employeeName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">Employee #{record.employeeId}</p>
                </div>
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-500">KPI</p>
                  <p className="mt-1 text-2xl font-extrabold text-blue-700">
                    {record.score}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Target</span>
                  <span className="font-semibold text-slate-900">
                    {Math.max(record.score - 5, 0)}
                  </span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                    style={{ width: `${Math.min(record.score, 100)}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Review date</span>
                  <span className="font-semibold text-slate-900">{record.reviewDate}</span>
                </div>
                <p className="mt-4 text-sm text-slate-500">{record.notes}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="surface-card rounded-[2rem] border-dashed p-10 text-center text-sm text-slate-500 xl:col-span-3">
            No KPI records match the selected filters.
          </div>
        )}
      </section>
    </div>
  )
}

export default KpiPage
