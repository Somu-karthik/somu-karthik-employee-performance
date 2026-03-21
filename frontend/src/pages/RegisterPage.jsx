import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerUser } from '../services'

function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please complete all fields before submitting.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (name.trim().length < 3) {
      setError('Name must be at least 3 characters long.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser({ name, email, password })
      setSuccessMessage('Registration successful. Redirecting to login...')

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1000)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'We could not create your account right now.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="surface-card hidden p-10 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-600">
            Onboarding
          </p>
          <h1 className="mt-5 text-5xl font-extrabold leading-tight text-slate-900">
            Build your workspace with a cleaner, more focused product shell.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-slate-500">
            Create an account to unlock employee records, KPI tracking, dashboards, and modern reporting in one place.
          </p>

          <div className="mt-10 grid gap-4">
            {[
              ['Role-based setup', 'Assign admin, manager, or employee access from the start.'],
              ['Faster rollout', 'Bring teams into one organized workspace without cluttered onboarding.'],
              ['Consistent UI', 'The same layout system carries from sign-up to reporting.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[24px] bg-[linear-gradient(135deg,#eff6ff_0%,#ede9fe_100%)] p-5">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card-strong mx-auto w-full max-w-2xl p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Registration
          </p>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Create account</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Set up your profile to access the employee performance workspace.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                className="input-surface w-full px-4 py-3.5"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                className="input-surface w-full px-4 py-3.5"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                className="input-surface w-full px-4 py-3.5"
              />
            </div>

            {error ? (
              <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full px-4 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <Link className="font-semibold text-blue-600" to="/login">
              Back to login
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default RegisterPage
