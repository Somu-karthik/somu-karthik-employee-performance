function ProfilePage() {
  return (
    <div className="space-y-6">
      <section className="surface-card-strong p-6 sm:p-7 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          Profile
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Your account</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Review your workspace identity, team context, and account preferences from one clean profile page.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="surface-card p-6">
          <h2 className="text-lg font-bold text-slate-900">Profile summary</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ['Name', 'HR Admin'],
              ['Email', 'hr.admin@company.com'],
              ['Role', 'People Ops / Admin'],
              ['Workspace', 'Employee Performance Tracker'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="text-lg font-bold text-slate-900">Preferences</h2>
          <div className="mt-5 space-y-3">
            {[
              'Email alerts enabled',
              'Weekly performance digest active',
              'Manager visibility shared',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
