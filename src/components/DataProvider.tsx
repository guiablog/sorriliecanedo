import { useEffect, useState } from 'react'
import { usePatientStore } from '@/stores/patient'
import { useProfessionalStore } from '@/stores/professional'
import { useServiceStore } from '@/stores/service'
import { useAppointmentStore } from '@/stores/appointment'
import { useContentStore } from '@/stores/content'
import { useNotificationStore } from '@/stores/notification'
import { useAppSettingsStore } from '@/stores/appSettings'

interface DataProviderProps {
  children: React.ReactNode
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [isLoading, setIsLoading] = useState(true)
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
  const { settings, fetchAppSettings } = useAppSettingsStore()

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchPatients(),
        fetchProfessionals(),
        fetchServices(),
        fetchAppointments(),
        fetchContent(),
        fetchNotifications(),
        fetchAppSettings(),
      ])
      setIsLoading(false)
    }
    fetchAllData()
  }, [
    fetchPatients,
    fetchProfessionals,
    fetchServices,
    fetchAppointments,
    fetchContent,
    fetchNotifications,
    fetchAppSettings,
  ])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary animate-fade-in">
        {settings?.splash_screen_image_url && (
          <img
            src={settings.splash_screen_image_url}
            alt="Sorriliê Odontologia Logo"
            className="w-48 h-auto animate-pulse"
          />
        )}
      </div>
    )
  }

  return <>{children}</>
}
