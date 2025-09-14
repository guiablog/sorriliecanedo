import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

interface ProtectedRouteProps {
  allowedRoles: Array<'patient' | 'admin'>
  redirectPath?: string
}

export const ProtectedRoute = ({
  allowedRoles,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, userType } = useAuthStore()

  if (!isAuthenticated || !userType || !allowedRoles.includes(userType)) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}
