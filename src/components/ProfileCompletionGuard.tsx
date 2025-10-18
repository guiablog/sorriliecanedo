import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { usePatientStore } from '@/stores/patient'
import { PageLoader } from '@/components/PageLoader'

export const ProfileCompletionGuard = () => {
  const location = useLocation()
  const {
    isAuthenticated,
    userType,
    name,
    loading: authLoading,
  } = useAuthStore()
  const { patients, loading: patientsLoading } = usePatientStore()

  const isLoading = authLoading || patientsLoading

  if (isLoading) {
    return <PageLoader />
  }

  if (isAuthenticated && userType === 'patient') {
    const currentUser = patients.find((p) => p.name === name)

    if (currentUser && !currentUser.whatsapp) {
      if (location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />
      }
    }

    if (currentUser?.whatsapp && location.pathname === '/complete-profile') {
      return <Navigate to="/home" replace />
    }
  }

  return <Outlet />
}
