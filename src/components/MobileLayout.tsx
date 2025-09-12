import { Outlet, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { Button } from '@/components/ui/button'

const routeTitles: { [key: string]: string } = {
  '/': 'Início',
  '/schedule': 'Agendar Consulta',
  '/content': 'Conteúdo Educativo',
  '/profile': 'Meu Perfil',
}

export default function MobileLayout() {
  const location = useLocation()
  const title = routeTitles[location.pathname] || 'Sorriliê Odontologia'
  const showBackButton = location.pathname !== '/'

  return (
    <div className="min-h-screen bg-neutral-light">
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-center h-14 bg-white shadow-sm">
        {showBackButton && (
          <Link to="/" className="absolute left-4">
            <ArrowLeft className="h-6 w-6 text-neutral-dark" />
          </Link>
        )}
        <h1 className="text-lg font-semibold text-neutral-dark">{title}</h1>
      </header>

      <main className="pt-14 pb-20">
        <Outlet />
      </main>

      <a
        href="https://wa.me/5511999999999" // Replace with actual WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-10"
      >
        <Button
          size="icon"
          className="rounded-full h-14 w-14 bg-accent hover:bg-accent/90 shadow-lg animate-pulse"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Button>
      </a>

      <BottomNav />
    </div>
  )
}
