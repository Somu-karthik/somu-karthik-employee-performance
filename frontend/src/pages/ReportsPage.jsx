import PageHeader from '../components/PageHeader'
import TableCard from '../components/TableCard'
import { reports } from '../services/mockData'

function ReportsPage() {
  const columns = ['Report', 'Owner', 'Last Updated', 'Format']
  const rows = reports.map((report) => [
    report.name,
    report.owner,
    report.updatedAt,
    report.format,
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reporting"
        title="Reports and exports"
        description="Access recurring analytics packs, leadership summaries, and payroll-ready exports."
        action="Generate report"
      />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['12', 'Available reports'],
          ['4', 'Scheduled exports'],
          ['98%', 'Delivery success'],
        ].map(([value, label]) => (
          <div key={label} className="surface-card p-5">
            <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </section>
      <TableCard title="Available reports" columns={columns} rows={rows} />
    </div>
  )
}

export default ReportsPage
