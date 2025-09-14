import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export default function SplashScreen() {
  const navigate = useNavigate()
  const { isAuthenticated, userType } = useAuthStore.getState()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (userType === 'patient') {
          navigate('/home')
        } else if (userType === 'admin') {
          navigate('/admin')
        } else {
          // Fallback for an unlikely state
          navigate('/onboarding')
        }
      } else {
        navigate('/onboarding')
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate, isAuthenticated, userType])

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary animate-fade-in">
      <img
        src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=white"
        alt="Sorriliê Odontologia Logo"
        className="w-48 h-auto"
      />
    </div>
  )
}
