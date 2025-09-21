import { create } from 'zustand'
import { notificationService } from '@/services/notificationService'

export interface Notification {
  title: string
  message?: string | null
  segment: string
  date: string // DD/MM/YYYY
}

interface NotificationState {
  notifications: Notification[]
  loading: boolean
  fetchNotifications: () => Promise<void>
  addNotification: (notification: Omit<Notification, 'date'>) => Promise<void>
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  loading: true,
  fetchNotifications: async () => {
    set({ loading: true })
    try {
      const notifications = await notificationService.getAllNotifications()
      set({ notifications, loading: false })
    } catch (error) {
      console.error('Failed to fetch notifications', error)
      set({ loading: false })
    }
  },
  addNotification: async (notification) => {
    const newNotification =
      await notificationService.addNotification(notification)
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }))
  },
}))
