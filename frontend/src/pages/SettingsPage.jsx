function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
          Settings
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Workspace settings</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Manage notifications, security preferences, and platform behavior from one organized settings area.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {[
          ['Notifications', 'Email digests, alerts, and employee update triggers.'],
          ['Security', 'Password policies, session settings, and account protection.'],
          ['Workspace', 'Branding, company defaults, and dashboard behavior.'],
          ['Integrations', 'Connect reporting tools and internal workflow systems.'],
        ].map(([title, description]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
          >
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default SettingsPage
