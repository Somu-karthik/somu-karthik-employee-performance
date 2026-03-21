import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../services'

function AuthRoute() {
  const token = getToken()

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default AuthRoute
