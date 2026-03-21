import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login as loginUser } from '../services'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const logoutMessage = location.state?.message || ''

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')

    if (isSubmitting) {
      return
    }

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email and password.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await loginUser({ email, password })

      if (!result?.token) {
        setError('Login failed. Please try again.')
        return
      }

      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          'Unable to sign in with those credentials.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="surface-card hidden p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="pill-label text-xs font-semibold uppercase tracking-[0.28em]">
              Employee Tracker
            </div>
            <h1 className="mt-6 max-w-lg text-5xl font-extrabold leading-tight text-slate-900">
              Sign in to a dashboard designed like a modern SaaS product.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-500">
              Review employee momentum, KPI trends, and reporting workflows from one clean operational workspace.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] bg-[linear-gradient(135deg,#dbeafe_0%,#ede9fe_100%)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Workspace snapshot
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ['216', 'Active users'],
                  ['89.4%', 'Avg KPI'],
                  ['12', 'Reports ready'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[22px] bg-white/80 p-4">
                    <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                    <p className="mt-2 text-sm text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-slate-900 p-6 text-white">
              <p className="text-sm leading-7 text-slate-300">
                Clean layout, generous white space, consistent blue and purple accents, and lightweight glass surfaces across every screen.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-card-strong mx-auto w-full max-w-xl p-8 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              Login
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Welcome back</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Use your account to open the employee performance dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {logoutMessage ? (
              <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {logoutMessage}
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                disabled={isSubmitting}
                autoComplete="email"
                className="input-surface w-full px-4 py-3.5"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  className="input-surface w-full px-4 py-3.5 pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={isSubmitting}
                  className="absolute inset-y-0 right-4 text-sm font-semibold text-blue-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-3 text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  disabled={isSubmitting}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-semibold text-blue-600">
                Forgot password?
              </a>
            </div>

            {error ? (
              <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full px-4 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>New to the platform?</span>
            <Link className="font-semibold text-blue-600" to="/register">
              Create your account
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
