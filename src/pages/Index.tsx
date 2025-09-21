import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { useAppSettingsStore } from '@/stores/appSettings'

export default function SplashScreen() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userType = useAuthStore((state) => state.userType)
  const { settings, fetchAppSettings } = useAppSettingsStore()

  useEffect(() => {
    fetchAppSettings()
  }, [fetchAppSettings])

  useEffect(() => {
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
  }, [navigate, isAuthenticated, userType])

  const defaultSplash =
    'https://img.usecurling.com/i?q=sorrilie-odontologia&color=white'
  const splashImage = settings?.splash_screen_image_url || defaultSplash

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary animate-fade-in">
      <img
        src={splashImage}
        alt="Sorriliê Odontologia Logo"
        className="w-48 h-auto"
      />
    </div>
  )
}
