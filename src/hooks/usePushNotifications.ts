import { useState, useEffect, useCallback } from 'react'
import { requestNotificationPermission } from '@/lib/firebase'
import { pushNotificationService } from '@/services/pushNotificationService'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase/client'

export const usePushNotifications = () => {
  const { isAuthenticated } = useAuthStore()
  const [permission, setPermission] = useState(Notification.permission)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkSubscription = useCallback(async () => {
    if (!isAuthenticated) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const subscription = await pushNotificationService.getSubscription(user.id)
    setIsSubscribed(!!subscription)
  }, [isAuthenticated])

  useEffect(() => {
    setPermission(Notification.permission)
    if (Notification.permission === 'granted') {
      checkSubscription()
    }
  }, [checkSubscription])

  const requestPermissionAndSubscribe = async () => {
    if (!isAuthenticated) {
      setError('User not authenticated.')
      return
    }
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError('User not found.')
      return
    }

    const token = await requestNotificationPermission()
    if (token) {
      const { error: saveError } =
        await pushNotificationService.saveSubscription(user.id, token)
      if (saveError) {
        setError('Failed to save subscription.')
      } else {
        setIsSubscribed(true)
        setPermission('granted')
        setError(null)
      }
    } else {
      setError('Permission not granted or token not available.')
      setPermission(Notification.permission)
    }
  }

  return {
    permission,
    isSubscribed,
    error,
    requestPermissionAndSubscribe,
  }
}
