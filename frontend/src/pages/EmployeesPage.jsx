import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import {
  addEmployee as createEmployee,
  deleteEmployee as removeEmployee,
  getEmployees,
  updateEmployee,
} from '../services'

const employeesPerPage = 5

function EmployeesPage() {
  const [employeeList, setEmployeeList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [editingEmployeeId, setEditingEmployeeId] = useState(null)
  const [isSubmittingEmployee, setIsSubmittingEmployee] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
  })

  const loadEmployees = async () => {
    setIsLoading(true)
    setError('')

    try {
      console.log('Fetching employees from:', '/api/employees')
      const response = await getEmployees()
      console.log('Employee fetch response:', response)
      console.log('Employee fetch data:', response.data ?? [])
      setEmployeeList(response.data ?? [])
    } catch (requestError) {
      console.error('Employee fetch failed:', requestError)
      setError(
        requestError.response?.data?.message ||
          'Unable to load employees right now.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return employeeList
    }

    return employeeList.filter((employee) =>
      [
        employee.name,
        employee.email,
        employee.position ?? employee.role,
        employee.department,
        String(employee.kpiScore),
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [employeeList, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / employeesPerPage))

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * employeesPerPage
    return filteredEmployees.slice(startIndex, startIndex + employeesPerPage)
  }, [currentPage, filteredEmployees])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
    })
    setEditingEmployeeId(null)
  }

  const handleEmployeeSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.position.trim()
    ) {
      setError('Name, email, and position are required.')
      return
    }

    setIsSubmittingEmployee(true)

    try {
      if (editingEmployeeId) {
        const response = await updateEmployee(editingEmployeeId, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          position: formData.position.trim(),
        })

        setEmployeeList((current) =>
          current.map((item) =>
            item.id === editingEmployeeId ? response.data : item,
          ),
        )
        setMessage(`${response.data.name} was updated.`)
      } else {
        const response = await createEmployee({
          name: formData.name.trim(),
          email: formData.email.trim(),
          position: formData.position.trim(),
        })

        setEmployeeList((current) => [response.data, ...current])
        setMessage(`${response.data.name} was added.`)
      }

      setCurrentPage(1)
      clearForm()
      setIsAddingEmployee(false)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to add employee right now.',
      )
    } finally {
      setIsSubmittingEmployee(false)
    }
  }

  const handleEditEmployee = (employeeId) => {
    setMessage('')
    setError('')

    const employee = employeeList.find((item) => item.id === employeeId)
    if (!employee) {
      return
    }
    setEditingEmployeeId(employeeId)
    setFormData({
      name: employee.name ?? '',
      email: employee.email ?? '',
      position: employee.position ?? employee.role ?? '',
    })
    setIsAddingEmployee(true)
  }

  const handleDeleteEmployee = async (employeeId) => {
    setMessage('')
    setError('')

    const employee = employeeList.find((item) => item.id === employeeId)
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee?.name ?? 'this employee'}?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await removeEmployee(employeeId)
      setEmployeeList((current) => current.filter((item) => item.id !== employeeId))
      setMessage(employee ? `${employee.name} was removed.` : 'Employee removed.')

      const nextTotal = Math.ceil((filteredEmployees.length - 1) / employeesPerPage)
      if (currentPage > Math.max(1, nextTotal)) {
        setCurrentPage(Math.max(1, nextTotal))
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to delete employee right now.',
      )
    }
  }

  const startRow = filteredEmployees.length === 0 ? 0 : (currentPage - 1) * employeesPerPage + 1
  const endRow = Math.min(currentPage * employeesPerPage, filteredEmployees.length)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Management"
        title="Employee management"
        description="Search, review, and manage employee records with KPI visibility and quick actions."
      />

      <section className="surface-card p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900">Employee records</h3>
            <p className="mt-1 text-sm text-slate-500">
              Keep your directory updated and monitor performance signals.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 xl:w-auto xl:flex-row">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, role, department, or KPI"
              className="input-surface w-full px-4 py-3 text-sm xl:min-w-[360px]"
            />
            <button
              type="button"
              onClick={loadEmployees}
              disabled={isLoading}
              className="btn-secondary shrink-0 px-5 py-3 text-sm font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMessage('')
                setError('')
                if (isAddingEmployee) {
                  clearForm()
                }
                setIsAddingEmployee((current) => !current)
              }}
              className="btn-primary shrink-0 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            >
              {isAddingEmployee ? 'Close form' : 'Add employee'}
            </button>
          </div>
        </div>

        {isAddingEmployee ? (
          <form
            className="mt-6 grid gap-4 rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-5 md:grid-cols-2 xl:grid-cols-4"
            onSubmit={handleEmployeeSubmit}
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                disabled={isSubmittingEmployee}
                placeholder="Employee name"
                className="input-surface w-full px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                disabled={isSubmittingEmployee}
                placeholder="Employee email"
                className="input-surface w-full px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Position
              </label>
              <input
                id="position"
                name="position"
                type="text"
                value={formData.position}
                onChange={handleFormChange}
                disabled={isSubmittingEmployee}
                placeholder="Employee position"
                className="input-surface w-full px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-4 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmittingEmployee}
                className="btn-primary px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmittingEmployee
                  ? editingEmployeeId
                    ? 'Updating employee...'
                    : 'Saving employee...'
                  : editingEmployeeId
                    ? 'Update employee'
                    : 'Save employee'}
              </button>
              <button
                type="button"
                onClick={() => {
                  clearForm()
                  setIsAddingEmployee(false)
                  setError('')
                }}
                disabled={isSubmittingEmployee}
                className="btn-secondary px-5 py-3 text-sm font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={loadEmployees}
                disabled={isLoading}
                className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200/80">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Position</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {isLoading ? (
                  Array.from({ length: employeesPerPage }).map((_, index) => (
                    <tr
                      key={`employee-skeleton-${index}`}
                      className="border-t border-slate-100 animate-pulse"
                    >
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="h-4 w-40 rounded bg-slate-200" />
                          <div className="h-3 w-24 rounded bg-slate-100" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-40 rounded bg-slate-200" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 rounded bg-slate-200" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 w-16 rounded-full bg-slate-200" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <div className="h-9 w-16 rounded-xl bg-slate-200" />
                          <div className="h-9 w-16 rounded-xl bg-slate-100" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-t border-slate-100 text-sm text-slate-600"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{employee.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                            Employee ID #{employee.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{employee.email}</td>
                      <td className="px-6 py-4">{employee.position ?? employee.role}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditEmployee(employee.id)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-slate-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">
            Showing {startRow}-{endRow} of {filteredEmployees.length} employees
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EmployeesPage
