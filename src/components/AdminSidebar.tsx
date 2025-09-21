import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  BookOpen,
  Bell,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppSettingsStore } from '@/stores/appSettings'

const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/patients', label: 'Pacientes', icon: Users },
  { to: '/admin/agenda', label: 'Agenda', icon: Calendar },
  {
    to: '/admin/professionals-services',
    label: 'Profissionais & Serviços',
    icon: Stethoscope,
  },
  { to: '/admin/content', label: 'Conteúdos', icon: BookOpen },
  { to: '/admin/notifications', label: 'Notificações', icon: Bell },
]

export const AdminSidebar = () => {
  const { settings } = useAppSettingsStore()
  const defaultLogo =
    'https://img.usecurling.com/i?q=sorrilie-odontologia&color=white'

  return (
    <aside className="hidden md:flex flex-col w-64 bg-primary text-primary-foreground">
      <div className="p-4 border-b border-primary-foreground/10">
        <img
          src={settings?.logo_url || defaultLogo}
          alt="Logo Sorriliê"
          className="h-10"
        />
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/80',
                isActive ? 'bg-secondary' : 'text-primary-foreground/80',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-2 border-t border-primary-foreground/10">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/80',
              isActive ? 'bg-secondary' : 'text-primary-foreground/80',
            )
          }
        >
          <Settings className="h-4 w-4" />
          Configurações
        </NavLink>
      </div>
    </aside>
  )
}
