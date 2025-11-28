import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { useAppSettingsStore } from '@/stores/appSettings'
import { Seo } from '@/components/Seo'
import { usePWAManager } from '@/hooks/use-pwa-manager'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Download, ArrowRight } from 'lucide-react'

export default function SplashScreen() {
  const navigate = useNavigate()
  const { isAuthenticated, userType, loading: authLoading } = useAuthStore()
  const { settings, loading: settingsLoading } = useAppSettingsStore()
  const { isInstallable, isInstalled, install } = usePWAManager()
  const isMobile = useIsMobile()
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  const isLoading = authLoading || settingsLoading

  const handleNavigation = () => {
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
  }

  useEffect(() => {
    // If the app is installed (standalone), we don't show the prompt
    // and we allow navigation to proceed.
    if (isInstalled) {
      setShowInstallPrompt(false)
    } else if (isInstallable && isMobile) {
      // If it's installable and mobile, we show the prompt and block navigation
      setShowInstallPrompt(true)
    }
  }, [isInstallable, isMobile, isInstalled])

  useEffect(() => {
    if (isLoading) {
      return
    }

    // If we are showing the install prompt, we pause navigation
    // unless the user has already installed it (isInstalled becomes true)
    if (showInstallPrompt && !isInstalled) {
      return
    }

    const timer = setTimeout(() => {
      handleNavigation()
    }, 1500)

    return () => clearTimeout(timer)
  }, [
    isLoading,
    isAuthenticated,
    userType,
    navigate,
    showInstallPrompt,
    isInstalled,
  ])

  const splashImage = settings?.splash_screen_image_url

  return (
    <>
      <Seo
        title="Bem-vindo à Sorriliê Odontologia"
        description="Aplicativo oficial da clínica Sorriliê Odontologia. Agende suas consultas e cuide do seu sorriso."
        ogImage={splashImage || undefined}
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary animate-fade-in p-6">
        <div className="flex-1 flex items-center justify-center">
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

        {showInstallPrompt && !isInstalled && (
          <div className="w-full max-w-xs space-y-4 animate-fade-in-up pb-10">
            <div className="text-center text-white mb-6">
              <h2 className="text-xl font-bold mb-2">Instale o App</h2>
              <p className="text-white/80 text-sm">
                Para uma melhor experiência, instale o aplicativo em seu
                dispositivo.
              </p>
            </div>
            <Button
              onClick={install}
              className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12"
            >
              <Download className="mr-2 h-5 w-5" />
              Instalar Aplicativo
            </Button>
            <Button
              onClick={handleNavigation}
              variant="ghost"
              className="w-full text-white hover:bg-white/10 hover:text-white"
            >
              Continuar para o App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
