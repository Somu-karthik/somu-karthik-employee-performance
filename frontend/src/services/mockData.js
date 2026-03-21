export const dashboardMetrics = [
  { label: 'Total Employees', value: '248', change: '+12 this month', tone: 'blue', icon: 'employees' },
  { label: 'Avg Performance', value: '89.4%', change: '+4.8%', tone: 'green', icon: 'trend' },
  { label: 'Active Users', value: '216', change: '87% adoption', tone: 'purple', icon: 'activity' },
]

export const spotlightEmployees = [
  { name: 'Ava Thompson', team: 'Engineering', score: '96/100', trend: 'Rising', goals: '12/13' },
  { name: 'Noah Patel', team: 'Product', score: '94/100', trend: 'Stable', goals: '10/11' },
  { name: 'Mia Johnson', team: 'Operations', score: '92/100', trend: 'Rising', goals: '11/12' },
  { name: 'Sophia Green', team: 'Customer Success', score: '91/100', trend: 'Rising', goals: '9/10' },
]

export const performanceTrendData = [
  { month: 'Jan', performance: 78, engagement: 72 },
  { month: 'Feb', performance: 81, engagement: 74 },
  { month: 'Mar', performance: 83, engagement: 77 },
  { month: 'Apr', performance: 85, engagement: 79 },
  { month: 'May', performance: 88, engagement: 82 },
  { month: 'Jun', performance: 89, engagement: 84 },
]

export const departmentDistributionData = [
  { name: 'Engineering', value: 72, fill: '#2563eb' },
  { name: 'Product', value: 38, fill: '#0ea5e9' },
  { name: 'Operations', value: 44, fill: '#38bdf8' },
  { name: 'Finance', value: 26, fill: '#60a5fa' },
  { name: 'People Ops', value: 18, fill: '#93c5fd' },
]

export const employees = [
  { id: 1, name: 'Ava Thompson', role: 'Senior Engineer', department: 'Engineering', kpiScore: 96 },
  { id: 2, name: 'Noah Patel', role: 'Product Manager', department: 'Product', kpiScore: 94 },
  { id: 3, name: 'Mia Johnson', role: 'Operations Lead', department: 'Operations', kpiScore: 92 },
  { id: 4, name: 'Ethan Brooks', role: 'Finance Analyst', department: 'Finance', kpiScore: 78 },
  { id: 5, name: 'Sophia Green', role: 'Success Manager', department: 'Customer Success', kpiScore: 91 },
  { id: 6, name: 'Liam Carter', role: 'HR Business Partner', department: 'People Ops', kpiScore: 88 },
  { id: 7, name: 'Olivia Stone', role: 'UX Designer', department: 'Design', kpiScore: 86 },
  { id: 8, name: 'James Wilson', role: 'Engineering Manager', department: 'Engineering', kpiScore: 95 },
  { id: 9, name: 'Emma Davis', role: 'Recruiter', department: 'People Ops', kpiScore: 84 },
  { id: 10, name: 'Benjamin Lee', role: 'Data Analyst', department: 'Strategy', kpiScore: 89 },
  { id: 11, name: 'Charlotte Hall', role: 'Marketing Lead', department: 'Marketing', kpiScore: 87 },
  { id: 12, name: 'Lucas White', role: 'Support Specialist', department: 'Customer Success', kpiScore: 83 },
]

export const kpiCards = [
  { label: 'Quarterly OKR completion', value: '78%', change: '+8%', tone: 'blue', icon: 'target' },
  { label: 'Manager check-ins', value: '91%', change: 'Healthy', tone: 'green', icon: 'check' },
  { label: 'Training adoption', value: '67%', change: '+11%', tone: 'purple', icon: 'activity' },
  { label: 'Attrition risk', value: '9%', change: 'Low', tone: 'orange', icon: 'alert' },
  { label: 'Promotion readiness', value: '34', change: 'Employees', tone: 'blue', icon: 'employees' },
  { label: 'Feedback turnaround', value: '2.8d', change: '-0.6d', tone: 'green', icon: 'clock' },
]

export const kpiDateRanges = [
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Year to date', value: 'ytd' },
]

export const employeeKpiRecords = [
  {
    id: 1,
    name: 'Ava Thompson',
    department: 'Engineering',
    role: 'Senior Engineer',
    score: 96,
    target: 92,
    progress: '12/13 goals',
    dateRange: '30d',
  },
  {
    id: 2,
    name: 'Noah Patel',
    department: 'Product',
    role: 'Product Manager',
    score: 94,
    target: 90,
    progress: '10/11 goals',
    dateRange: '30d',
  },
  {
    id: 3,
    name: 'Mia Johnson',
    department: 'Operations',
    role: 'Operations Lead',
    score: 92,
    target: 88,
    progress: '11/12 goals',
    dateRange: '30d',
  },
  {
    id: 4,
    name: 'James Wilson',
    department: 'Engineering',
    role: 'Engineering Manager',
    score: 95,
    target: 91,
    progress: '13/14 goals',
    dateRange: '90d',
  },
  {
    id: 5,
    name: 'Sophia Green',
    department: 'Customer Success',
    role: 'Success Manager',
    score: 91,
    target: 87,
    progress: '9/10 goals',
    dateRange: '90d',
  },
  {
    id: 6,
    name: 'Liam Carter',
    department: 'People Ops',
    role: 'HR Business Partner',
    score: 88,
    target: 85,
    progress: '8/10 goals',
    dateRange: 'ytd',
  },
]

export const kpiPerformanceByRange = {
  '30d': [
    { period: 'Week 1', performance: 82, target: 80 },
    { period: 'Week 2', performance: 85, target: 82 },
    { period: 'Week 3', performance: 87, target: 84 },
    { period: 'Week 4', performance: 90, target: 86 },
  ],
  '90d': [
    { period: 'Jan', performance: 78, target: 76 },
    { period: 'Feb', performance: 83, target: 80 },
    { period: 'Mar', performance: 86, target: 82 },
    { period: 'Apr', performance: 88, target: 84 },
    { period: 'May', performance: 91, target: 86 },
  ],
  ytd: [
    { period: 'Q1', performance: 80, target: 78 },
    { period: 'Q2', performance: 84, target: 81 },
    { period: 'Q3', performance: 89, target: 84 },
    { period: 'Q4', performance: 92, target: 87 },
  ],
}

export const kpiDepartmentByRange = {
  '30d': [
    { department: 'Engineering', score: 95 },
    { department: 'Product', score: 92 },
    { department: 'Operations', score: 90 },
    { department: 'People Ops', score: 87 },
  ],
  '90d': [
    { department: 'Engineering', score: 93 },
    { department: 'Customer Success', score: 90 },
    { department: 'Product', score: 89 },
    { department: 'Finance', score: 82 },
  ],
  ytd: [
    { department: 'Engineering', score: 91 },
    { department: 'People Ops', score: 88 },
    { department: 'Marketing', score: 85 },
    { department: 'Strategy', score: 87 },
  ],
}

export const reports = [
  { name: 'Executive performance summary', owner: 'People Ops', updatedAt: 'Mar 18, 2026', format: 'PDF' },
  { name: 'Department KPI pack', owner: 'Strategy', updatedAt: 'Mar 17, 2026', format: 'XLSX' },
  { name: 'Compensation review export', owner: 'Finance', updatedAt: 'Mar 15, 2026', format: 'CSV' },
]
