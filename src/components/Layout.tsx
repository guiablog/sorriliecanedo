import { Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { PushNotificationManager } from './PushNotificationManager'

export default function Layout() {
  const { isAuthenticated } = useAuthStore()

  return (
    <>
      {isAuthenticated && <PushNotificationManager />}
      <Outlet />
    </>
  )
}
