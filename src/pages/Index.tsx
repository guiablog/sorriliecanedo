import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { useAppSettingsStore } from '@/stores/appSettings'

export default function SplashScreen() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userType = useAuthStore((state) => state.userType)
  const { settings, loading } = useAppSettingsStore()

  useEffect(() => {
    if (loading) {
      return
    }

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (userType === 'patient') {
          navigate('/home')
        } else if (userType === 'admin') {
          navigate('/admin')
        } else {
          // Fallback for an unlikely state
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate, isAuthenticated, userType, loading])

  const splashImage = settings?.splash_screen_image_url

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary animate-fade-in">
      {!loading && splashImage ? (
        <img
          src={splashImage}
          alt="Sorriliê Odontologia Logo"
          className="w-48 h-auto animate-fade-in"
        />
      ) : null}
    </div>
  )
}
