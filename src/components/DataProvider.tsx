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
  const fetchProfessionals = useProfessionalStore(
    (state) => state.fetchProfessionals,
  )
  const fetchServices = useServiceStore((state) => state.fetchServices)
  const fetchAppointments = useAppointmentStore(
    (state) => state.fetchAppointments,
  )
  const fetchContent = useContentStore((state) => state.fetchContent)
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications,
  )
  const { fetchAppSettings } = useAppSettingsStore()
  const checkSession = useAuthStore((state) => state.checkSession)

  useEffect(() => {
    const initializeApp = () => {
      checkSession()
      fetchPatients()
      fetchProfessionals()
      fetchServices()
      fetchAppointments()
      fetchContent()
      fetchNotifications()
      fetchAppSettings()
    }
    initializeApp()
  }, [
    checkSession,
    fetchPatients,
    fetchProfessionals,
    fetchServices,
    fetchAppointments,
    fetchContent,
    fetchNotifications,
    fetchAppSettings,
  ])

  return <>{children}</>
}
