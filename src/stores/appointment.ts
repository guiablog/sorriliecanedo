import { create } from 'zustand'
import { appointmentService } from '@/services/appointmentService'
import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Tables } from '@/lib/supabase/types'

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
  patient_id: string | null
  date: string // YYYY-MM-DD
  time: string
  patient: string
  service: string
  professional: string
  status: AppointmentStatus
  rescheduleHistory?: RescheduleHistoryEntry[]
}

const mapRowToAppointment = (row: Tables<'appointments'>): Appointment => ({
  id: row.id,
  patient_id: row.patient_id,
  date: row.date,
  time: row.time,
  patient: row.patient_name,
  service: row.service_name,
  professional: row.professional_name,
  status: row.status as AppointmentStatus,
  rescheduleHistory: (row.reschedule_history as any) || [],
})

interface AppointmentState {
  appointments: Appointment[]
  loading: boolean
  channel: RealtimeChannel | null
  fetchAppointments: () => Promise<void>
  addAppointment: (
    appointment: Omit<Appointment, 'id' | 'patient_id'>,
    userId: string,
  ) => Promise<void>
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
  ) => Promise<void>
  rescheduleAppointment: (
    id: string,
    newDate: Date,
    newTime: string,
  ) => Promise<void>
  subscribe: () => void
  unsubscribe: () => void
}

export const useAppointmentStore = create<AppointmentState>()((set, get) => ({
  appointments: [],
  loading: true,
  channel: null,
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
  addAppointment: async (appointment, userId) => {
    const newAppointment = await appointmentService.addAppointment(
      appointment,
      userId,
    )
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
  subscribe: () => {
    if (get().channel) {
      return
    }
    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT': {
              const newAppointment = mapRowToAppointment(
                payload.new as Tables<'appointments'>,
              )
              set((state) => ({
                appointments: [...state.appointments, newAppointment],
              }))
              break
            }
            case 'UPDATE': {
              const updatedAppointment = mapRowToAppointment(
                payload.new as Tables<'appointments'>,
              )
              set((state) => ({
                appointments: state.appointments.map((a) =>
                  a.id === updatedAppointment.id ? updatedAppointment : a,
                ),
              }))
              break
            }
            case 'DELETE': {
              const oldAppointment = payload.old as Partial<
                Tables<'appointments'>
              >
              if (oldAppointment.id) {
                set((state) => ({
                  appointments: state.appointments.filter(
                    (a) => a.id !== oldAppointment.id,
                  ),
                }))
              }
              break
            }
          }
        },
      )
      .subscribe()
    set({ channel })
  },
  unsubscribe: () => {
    const { channel } = get()
    if (channel) {
      supabase.removeChannel(channel)
      set({ channel: null })
    }
  },
}))
