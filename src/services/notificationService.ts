import { supabase } from '@/lib/supabase/client'
import { Notification } from '@/stores/notification'
import { format } from 'date-fns'

export const notificationService = {
  async getAllNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
    return data.map((n) => ({
      title: n.title,
      message: n.message,
      segment: n.segment,
      date: format(new Date(n.created_at), 'dd/MM/yyyy'),
    }))
  },

  async addNotification(
    notificationData: Omit<Notification, 'date'>,
  ): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()

    if (error) {
      console.error('Error adding notification:', error)
      throw error
    }
    return {
      title: data.title,
      message: data.message,
      segment: data.segment,
      date: format(new Date(data.created_at), 'dd/MM/yyyy'),
    }
  },
}
