import { Outlet, useLocation, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { useAppSettingsStore } from '@/stores/appSettings'

const routeTitles: { [key: string]: string } = {
  '/home': 'Início',
  '/schedule': 'Agendar Consulta',
  '/content': 'Conteúdo Educativo',
  '/profile': 'Meu Perfil',
  '/loyalty': 'Programa de Fidelidade',
}

export default function MobileLayout() {
  const location = useLocation()
  const { settings } = useAppSettingsStore()
  const title = routeTitles[location.pathname] || 'Sorriliê Odontologia'
  const showBackButton = location.pathname !== '/home'
  const whatsappNumber = settings?.whatsapp_contact || '5511999999999'

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-center h-14 bg-white shadow-sm">
        {showBackButton && (
          <Link to="/home" className="absolute left-4">
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Link>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </header>

      <main className="pt-14 pb-20">
        <Outlet />
      </main>

      <a
        href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-10"
      >
        <Button
          size="icon"
          className="rounded-full h-14 w-14 bg-success hover:bg-success/90 shadow-lg animate-pulse"
        >
          <img
            src="https://img.usecurling.com/i?q=whatsapp&color=white&shape=hand-drawn"
            alt="WhatsApp"
            className="h-8 w-8"
          />
        </Button>
      </a>

      <BottomNav />
    </div>
  )
}
