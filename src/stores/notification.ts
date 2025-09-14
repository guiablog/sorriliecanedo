import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface Notification {
  title: string
  segment: string
  date: string // DD/MM/YYYY
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
}

const initialNotifications: Notification[] = [
  {
    title: 'Promoção de Clareamento',
    segment: 'Todos os Pacientes',
    date: '12/10/2025',
  },
  {
    title: 'Lembrete de Agendamento',
    segment: 'Pacientes com consulta',
    date: '11/10/2025',
  },
  {
    title: 'Dicas de Saúde Bucal',
    segment: 'Todos os Pacientes',
    date: '10/10/2025',
  },
  {
    title: 'Horários de Fim de Ano',
    segment: 'Todos os Pacientes',
    date: '01/10/2025',
  },
]

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: initialNotifications,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
