import { useEffect } from 'react'
import { onForegroundMessage } from '@/lib/firebase'
import { toast } from '@/components/ui/use-toast'
import { usePushNotifications } from '@/hooks/usePushNotifications'

export const PushNotificationManager = () => {
  const { permission, isSubscribed, requestPermissionAndSubscribe } =
    usePushNotifications()

  useEffect(() => {
    if (permission === 'granted' && !isSubscribed) {
      requestPermissionAndSubscribe()
    }
  }, [permission, isSubscribed, requestPermissionAndSubscribe])

  useEffect(() => {
    onForegroundMessage()
      .then((payload: any) => {
        console.log('Foreground message received:', payload)
        toast({
          title: payload.notification.title,
          description: payload.notification.body,
        })
      })
      .catch((err) =>
        console.log(
          'An error occurred while receiving foreground message. ',
          err,
        ),
      )
  }, [])

  return null
}
