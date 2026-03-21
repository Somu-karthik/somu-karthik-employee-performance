export const navigationItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    description: 'Overview and live performance metrics',
  },
  {
    path: '/employees',
    label: 'Employees',
    description: 'Directory, updates, and status',
  },
  {
    path: '/reports',
    label: 'Reports',
    description: 'Exports, summaries, and analytics',
  },
  {
    path: '/settings',
    label: 'Settings',
    description: 'Preferences and workspace controls',
  },
]

const pageMeta = {
  '/home': {
    title: 'Dashboard',
    subtitle: 'Manage employees, monitor performance, and track team progress.',
  },
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Manage employees, monitor performance, and track team progress.',
  },
  '/employees': {
    title: 'Employees',
    subtitle: 'Review employee profiles, status, and records in one place.',
  },
  '/reports': {
    title: 'Reports',
    subtitle: 'Prepare exports and leadership-ready analytics summaries.',
  },
  '/profile': {
    title: 'Profile',
    subtitle: 'Review your account details and workspace identity.',
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'Configure workspace preferences, notifications, and account options.',
  },
}

export function getPageMeta(pathname) {
  return (
    pageMeta[pathname] ?? {
      title: 'KPI Tracker',
      subtitle: 'Employee performance intelligence built for modern teams.',
    }
  )
}
