import { useEffect, useState } from 'react'
import { usePatientStore } from '@/stores/patient'
import { useProfessionalStore } from '@/stores/professional'
import { useServiceStore } from '@/stores/service'
import { useAppointmentStore } from '@/stores/appointment'
import { useContentStore } from '@/stores/content'
import { useNotificationStore } from '@/stores/notification'

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
  ])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <img
          src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=white"
          alt="Sorriliê Odontologia Logo"
          className="w-48 h-auto animate-pulse"
        />
      </div>
    )
  }

  return <>{children}</>
}
