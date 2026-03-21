import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { removeToken } from '../services'
import { getPageMeta } from '../utils/navigation'

function TopNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const page = getPageMeta(location.pathname)

  const handleLogout = () => {
    removeToken()
    navigate('/login', {
      replace: true,
      state: { message: 'You have been logged out successfully.' },
    })
  }

  return (
    <header className="sticky top-3 z-40 sm:top-4">
      <div className="surface-card-strong overflow-hidden border border-slate-200/80 bg-white/92 px-4 py-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur sm:px-6 lg:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt="Employee Tracker logo"
              className="h-11 w-11 shrink-0 rounded-2xl object-cover shadow-lg shadow-blue-500/25"
            />
            <div className="flex min-w-0 flex-col justify-center">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">
                Employee Performance Tracker
              </p>
              <p className="truncate text-base font-bold text-slate-900">
                {page.title}
              </p>
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <div className="hidden max-w-[420px] truncate rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 xl:block">
              {page.subtitle}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="motion-button shrink-0 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(220,38,38,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[0_18px_36px_rgba(220,38,38,0.34)]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
