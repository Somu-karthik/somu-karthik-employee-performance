import { Link, useLocation } from 'react-router-dom'
import { navigationItems } from '../utils/navigation'

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-full lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:w-72 lg:flex-none">
      <div className="surface-card flex h-full flex-col overflow-hidden p-5 sm:p-6 lg:max-h-[calc(100vh-3rem)]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb_0%,#4f46e5_55%,#7c3aed_100%)] text-lg font-extrabold text-white shadow-lg shadow-blue-500/30">
            ET
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              SaaS Workspace
            </p>
            <h1 className="mt-1 text-xl font-extrabold leading-tight text-slate-900 xl:text-2xl">
              Employee Tracker
            </h1>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            Workspace pulse
          </p>
          <p className="mt-3 text-4xl font-extrabold text-slate-900">92%</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Team performance is trending upward with strong review completion this week.
          </p>
        </div>

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1 lg:pr-2">
          <nav className="grid gap-3">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block rounded-[22px] px-4 py-4 transition ${
                    isActive
                      ? 'bg-slate-900 shadow-lg shadow-slate-300/40'
                      : 'bg-white/70 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <span
                    className={`block text-sm font-semibold ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`mt-1 block text-xs leading-5 ${
                      isActive ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.description}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="grid gap-3 pt-6">
            <div className="rounded-[22px] border border-green-100 bg-green-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Active employees
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">214</p>
            </div>
            <div className="rounded-[22px] border border-purple-100 bg-purple-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Tasks completed
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">148</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
