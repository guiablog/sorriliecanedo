import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { useAppSettingsStore } from '@/stores/appSettings'
import { Seo } from '@/components/Seo'

export default function SplashScreen() {
  const navigate = useNavigate()
  const { isAuthenticated, userType, loading: authLoading } = useAuthStore()
  const { settings, loading: settingsLoading } = useAppSettingsStore()

  const isLoading = authLoading || settingsLoading

  useEffect(() => {
    if (isLoading) {
      return
    }

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (userType === 'patient') {
          navigate('/home')
        } else if (userType === 'admin') {
          navigate('/admin')
        } else {
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [isLoading, isAuthenticated, userType, navigate])

  const splashImage = settings?.splash_screen_image_url

  return (
    <>
      <Seo
        title="Bem-vindo à Sorriliê Odontologia"
        description="Aplicativo oficial da clínica Sorriliê Odontologia. Agende suas consultas e cuide do seu sorriso."
        ogImage={splashImage || undefined}
      />
      <div className="flex items-center justify-center min-h-screen bg-primary animate-fade-in">
        {splashImage ? (
          <img
            src={splashImage}
            alt="Sorriliê Odontologia Logo"
            className="w-48 h-auto animate-pulse"
          />
        ) : (
          <div className="w-48 h-48" />
        )}
      </div>
    </>
  )
}
