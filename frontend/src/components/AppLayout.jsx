import { Outlet } from 'react-router-dom'
import ChatBox from './ChatBox'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'

function AppLayout() {
  return (
    <div className="app-shell text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-4 sm:px-6 lg:flex-row lg:items-start lg:px-8 lg:py-6">
        <Sidebar />
        <div className="min-w-0 flex-1 lg:pl-6">
          <TopNavbar />
          <main className="min-w-0 pt-6 pb-32 sm:pb-36">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <ChatBox />
    </div>
  )
}

export default AppLayout
