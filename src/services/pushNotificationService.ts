import { supabase } from '@/lib/supabase/client'

export const pushNotificationService = {
  async saveSubscription(
    userId: string,
    fcmToken: string,
  ): Promise<{ error: any }> {
    const { error } = await supabase.from('user_push_subscriptions').upsert(
      {
        user_id: userId,
        fcm_token: fcmToken,
      },
      { onConflict: 'user_id,fcm_token' },
    )

    if (error) {
      console.error('Error saving push subscription:', error)
    }
    return { error }
  },

  async deleteSubscription(fcmToken: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_push_subscriptions')
      .delete()
      .eq('fcm_token', fcmToken)

    if (error) {
      console.error('Error deleting push subscription:', error)
    }
    return { error }
  },

  async getSubscription(userId: string): Promise<{ fcm_token: string } | null> {
    const { data, error } = await supabase
      .from('user_push_subscriptions')
      .select('fcm_token')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error getting push subscription:', error)
      return null
    }
    return data
  },
}
