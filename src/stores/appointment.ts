import { create } from 'zustand'
import { appointmentService } from '@/services/appointmentService'

interface RescheduleHistoryEntry {
  previousDate: string
  previousTime: string
  newDate: string
  newTime: string
  changedAt: string
}

export type AppointmentStatus =
  | 'Confirmado'
  | 'Pendente'
  | 'Cancelado'
  | 'Realizado'
  | 'Remarcada'

export interface Appointment {
  id: string
  date: string // YYYY-MM-DD
  time: string
  patient: string
  service: string
  professional: string
  status: AppointmentStatus
  rescheduleHistory?: RescheduleHistoryEntry[]
}

interface AppointmentState {
  appointments: Appointment[]
  loading: boolean
  fetchAppointments: () => Promise<void>
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
  ) => Promise<void>
  rescheduleAppointment: (
    id: string,
    newDate: Date,
    newTime: string,
  ) => Promise<void>
}

export const useAppointmentStore = create<AppointmentState>()((set) => ({
  appointments: [],
  loading: true,
  fetchAppointments: async () => {
    set({ loading: true })
    try {
      const appointments = await appointmentService.getAllAppointments()
      set({ appointments, loading: false })
    } catch (error) {
      console.error('Failed to fetch appointments', error)
      set({ loading: false })
    }
  },
  addAppointment: async (appointment) => {
    const newAppointment = await appointmentService.addAppointment(appointment)
    set((state) => ({
      appointments: [...state.appointments, newAppointment],
    }))
  },
  updateAppointmentStatus: async (id, status) => {
    const updatedAppointment = await appointmentService.updateAppointmentStatus(
      id,
      status,
    )
    set((state) => ({
      appointments: state.appointments.map((appt) =>
        appt.id === id ? updatedAppointment : appt,
      ),
    }))
  },
  rescheduleAppointment: async (id, newDate, newTime) => {
    const updatedAppointment = await appointmentService.rescheduleAppointment(
      id,
      newDate,
      newTime,
    )
    set((state) => ({
      appointments: state.appointments.map((appt) =>
        appt.id === id ? updatedAppointment : appt,
      ),
    }))
  },
}))
