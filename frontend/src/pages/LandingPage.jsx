import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import logo from '../assets/logo.svg'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Contact', href: '#contact' },
]

const features = [
  {
    title: 'Employee Tracking',
    description: 'Maintain a structured employee directory with roles, status, and performance visibility.',
    tone: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
        <path d="M4 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm16 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      </svg>
    ),
  },
  {
    title: 'KPI Dashboard',
    description: 'Visualize team health, average performance, and growth trends through focused analytics.',
    tone: 'green',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 16 9 11l3 3 8-8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6h4v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Real-time Reports',
    description: 'Generate clean leadership-ready views for team distribution, performance, and completion rates.',
    tone: 'purple',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 3.5h7l4 4v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5v-14A2 2 0 0 1 8 3.5Z" strokeLinejoin="round" />
        <path d="M14 3.5v4h4M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Secure Authentication',
    description: 'Protect private dashboards with JWT-based authentication and guarded application routes.',
    tone: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 10V7.8a4 4 0 1 1 8 0V10" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M12 14v2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const testimonials = [
  {
    name: 'Priya Nair',
    role: 'HR Manager',
    quote: 'The platform made our review cycle easier to manage and far more readable for managers.',
  },
  {
    name: 'Daniel Brooks',
    role: 'Operations Lead',
    quote: 'We moved from scattered spreadsheets to one dashboard that actually helps us make decisions.',
  },
  {
    name: 'Aisha Rahman',
    role: 'People Ops',
    quote: 'The interface feels modern, the reports are clear, and onboarding new managers is much faster.',
  },
]

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16)

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const featureToneClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(219,234,254,0.95),transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_48%,#f8fbff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <header
          className={`sticky top-4 z-50 rounded-[28px] border px-4 py-4 transition sm:px-6 ${
            isScrolled
              ? 'border-white/70 bg-white/92 shadow-2xl shadow-slate-300/40 backdrop-blur-xl'
              : 'border-white/70 bg-white/80 shadow-lg shadow-slate-200/70 backdrop-blur-md'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <a href="#home" className="flex min-w-0 items-center gap-3">
              <img src={logo} alt="Employee Tracker" className="h-12 w-12 rounded-2xl object-cover shadow-md" />
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-slate-900">Employee Tracker</p>
                <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                  Performance management
                </p>
              </div>
            </a>

            <nav className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex">
              <Link
                to="/login"
                className="inline-flex min-w-[120px] items-center justify-center whitespace-nowrap rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold leading-none text-white transition hover:scale-105 hover:bg-slate-800 hover:shadow-lg"
              >
                <span className="block text-sm font-semibold leading-none text-white">Login</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 lg:hidden"
              aria-label="Toggle navigation"
            >
              <span className="flex flex-col gap-1.5">
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>
          </div>

          {isMenuOpen ? (
            <div className="grid gap-2 border-t border-slate-200 pt-4 lg:hidden">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold leading-none text-white"
              >
                <span className="block text-sm font-semibold leading-none text-white">Login</span>
              </Link>
            </div>
          ) : null}
        </header>

        <main className="space-y-10 pt-8 lg:space-y-16 lg:pt-12">
          <section id="home" className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Modern workforce platform
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Track employee performance efficiently.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                A modern employee performance tracker for teams that need cleaner reporting,
                better visibility, and a secure workspace for daily operations.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="rounded-full bg-blue-600 px-6 py-4 text-center text-sm font-semibold text-white transition hover:scale-105 hover:bg-blue-500 hover:shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border border-slate-200 bg-white px-6 py-4 text-center text-sm font-semibold text-slate-800 transition hover:scale-105 hover:border-blue-200 hover:text-blue-700 hover:shadow-md"
                >
                  Login
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['250+', 'Active teams'],
                  ['93%', 'Review completion'],
                  ['24/7', 'Data visibility'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                    <p className="mt-2 text-sm text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[32px] bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(124,58,237,0.16))] blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white p-4 shadow-2xl shadow-slate-300/40">
                <img
                  src={heroImage}
                  alt="Employee performance tracker dashboard preview"
                  className="w-full rounded-[24px] border border-slate-100 object-cover"
                />
              </div>
            </div>
          </section>

          <section
            id="about"
            className="grid gap-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr] lg:p-10"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">
                About Company
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-900 lg:text-4xl">
                Built to help companies manage performance with clarity.
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Employee Tracker helps organizations centralize employee data, measure
                performance, and simplify reporting through a secure and readable web platform.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-6">
                <h3 className="text-xl font-bold text-slate-900">Mission</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Make employee performance management easier to run, easier to read, and easier to improve.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-6">
                <h3 className="text-xl font-bold text-slate-900">Vision</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Give modern teams a reliable workspace for tracking performance, alignment, and growth.
                </p>
              </div>
            </div>
          </section>

          <section id="features" className="scroll-mt-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">
                Our Features
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-900 lg:text-4xl">
                Everything teams need for employee performance tracking.
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Designed with clean cards, strong contrast, and practical workflows for HR, managers, and operations teams.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:scale-105 hover:shadow-[0_22px_46px_rgba(15,23,42,0.12)]"
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${featureToneClasses[feature.tone]}`}>
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">
                Testimonials
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-900 lg:text-4xl">
                What teams say about the product.
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                Feedback from users managing employee reviews, performance reporting, and daily operations.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {testimonials.map((item) => (
                <article
                  key={item.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <p className="text-sm leading-7 text-slate-600">"{item.quote}"</p>
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-blue-700">{item.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer
          id="contact"
          className="mt-10 rounded-[32px] bg-slate-950 px-6 py-10 text-white shadow-2xl shadow-slate-400/30 lg:px-10"
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src={logo} alt="Employee Tracker" className="h-12 w-12 rounded-2xl object-cover" />
                <div>
                  <p className="text-lg font-bold">Employee Tracker</p>
                  <p className="text-sm text-slate-400">Professional performance tracking for modern companies</p>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                Build a better employee review workflow with secure access, clear dashboards, and modern reporting.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-200">
                Links
              </h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-400">
                <a href="#home" className="transition hover:text-white">Home</a>
                <a href="#about" className="transition hover:text-white">About</a>
                <a href="#features" className="transition hover:text-white">Features</a>
                <Link to="/login" className="transition hover:text-white">Login</Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-200">
                Contact
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <p>hello@employeetracker.com</p>
                <p>+91 98765 43210</p>
                <p>Bengaluru, India</p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-5 text-sm text-slate-500">
            Copyright © 2026 Employee Tracker. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
