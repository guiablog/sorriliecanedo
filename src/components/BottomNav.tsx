import { NavLink } from 'react-router-dom'
import { Home, Calendar, BookOpen, User, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/home', label: 'Início', icon: Home },
  { to: '/schedule', label: 'Agendar', icon: Calendar },
  { to: '/loyalty', label: 'Fidelidade', icon: Trophy },
  { to: '/content', label: 'Conteúdo', icon: BookOpen },
  { to: '/profile', label: 'Perfil', icon: User },
]

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/home'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full text-neutral-dark/70 transition-all duration-200 pt-1',
                { 'text-accent scale-105 font-semibold': isActive },
              )
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
