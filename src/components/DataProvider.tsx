import { useEffect } from 'react'
import { usePatientStore } from '@/stores/patient'
import { useProfessionalStore } from '@/stores/professional'
import { useServiceStore } from '@/stores/service'
import { useAppointmentStore } from '@/stores/appointment'
import { useContentStore } from '@/stores/content'
import { useNotificationStore } from '@/stores/notification'
import { useAppSettingsStore } from '@/stores/appSettings'
import { useAuthStore } from '@/stores/auth'

interface DataProviderProps {
  children: React.ReactNode
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const fetchPatients = usePatientStore((state) => state.fetchPatients)
  const subscribeToPatients = usePatientStore((state) => state.subscribe)
  const unsubscribeFromPatients = usePatientStore((state) => state.unsubscribe)
  const fetchProfessionals = useProfessionalStore(
    (state) => state.fetchProfessionals,
  )
  const fetchServices = useServiceStore((state) => state.fetchServices)
  const fetchAppointments = useAppointmentStore(
    (state) => state.fetchAppointments,
  )
  const subscribeToAppointments = useAppointmentStore(
    (state) => state.subscribe,
  )
  const unsubscribeFromAppointments = useAppointmentStore(
    (state) => state.unsubscribe,
  )
  const fetchContent = useContentStore((state) => state.fetchContent)
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications,
  )
  const fetchAppSettings = useAppSettingsStore(
    (state) => state.fetchAppSettings,
  )
  const initializeAuthListener = useAuthStore(
    (state) => state.initializeAuthListener,
  )

  useEffect(() => {
    const unsubscribeAuth = initializeAuthListener()

    fetchPatients()
    fetchProfessionals()
    fetchServices()
    fetchAppointments()
    fetchContent()
    fetchNotifications()
    fetchAppSettings()

    subscribeToPatients()
    subscribeToAppointments()

    return () => {
      unsubscribeAuth()
      unsubscribeFromPatients()
      unsubscribeFromAppointments()
    }
  }, [
    initializeAuthListener,
    fetchPatients,
    fetchProfessionals,
    fetchServices,
    fetchAppointments,
    fetchContent,
    fetchNotifications,
    fetchAppSettings,
    subscribeToPatients,
    unsubscribeFromPatients,
    subscribeToAppointments,
    unsubscribeFromAppointments,
  ])

  return <>{children}</>
}
