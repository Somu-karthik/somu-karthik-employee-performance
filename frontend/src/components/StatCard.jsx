function StatCard({ label, value, change, tone = 'default', icon }) {
  const toneClasses = {
    default: 'border-slate-200/80 bg-white text-slate-900',
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    green: 'border-green-100 bg-green-50 text-green-700',
    purple: 'border-purple-100 bg-purple-50 text-purple-700',
    orange: 'border-orange-100 bg-orange-50 text-orange-700',
  }

  const iconClasses = {
    default: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
  }

  const iconMap = {
    employees: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
        <path d="M4 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm16 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      </svg>
    ),
    trend: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 16 9 11l3 3 8-8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6h4v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    activity: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12h4l2.5-5 3 10 2.5-5H20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    target: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 12.5 9 16.5 19 6.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    alert: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 8v5" strokeLinecap="round" />
        <path d="M12 16.5h.01" strokeLinecap="round" />
        <path d="M10.3 3.9 2.6 17.2A1.5 1.5 0 0 0 3.9 19.5h16.2a1.5 1.5 0 0 0 1.3-2.3L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z" strokeLinejoin="round" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  }

  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)] ${toneClasses[tone]}`}
    >
      {iconMap[icon] ? (
        <div
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${iconClasses[tone]}`}
        >
          {iconMap[icon]}
        </div>
      ) : null}
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          {change}
        </span>
      </div>
    </div>
  )
}

export default StatCard
