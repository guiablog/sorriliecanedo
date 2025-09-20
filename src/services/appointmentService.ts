import { supabase } from '@/lib/supabase/client'
import { Appointment, AppointmentStatus } from '@/stores/appointment'
import { format } from 'date-fns'

export const appointmentService = {
  async getAllAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase.from('appointments').select('*')
    if (error) {
      console.error('Error fetching appointments:', error)
      throw error
    }
    return data.map((a) => ({
      id: a.id,
      date: a.date,
      time: a.time,
      patient: a.patient_name,
      service: a.service_name,
      professional: a.professional_name,
      status: a.status as AppointmentStatus,
      rescheduleHistory: a.reschedule_history || [],
    }))
  },

  async addAppointment(
    appointmentData: Omit<Appointment, 'id'>,
  ): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_name: appointmentData.patient,
        professional_name: appointmentData.professional,
        service_name: appointmentData.service,
        date: appointmentData.date,
        time: appointmentData.time,
        status: appointmentData.status,
        reschedule_history: appointmentData.rescheduleHistory || [],
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding appointment:', error)
      throw error
    }
    return {
      id: data.id,
      date: data.date,
      time: data.time,
      patient: data.patient_name,
      service: data.service_name,
      professional: data.professional_name,
      status: data.status as AppointmentStatus,
      rescheduleHistory: data.reschedule_history || [],
    }
  },

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating appointment status:', error)
      throw error
    }
    return {
      id: data.id,
      date: data.date,
      time: data.time,
      patient: data.patient_name,
      service: data.service_name,
      professional: data.professional_name,
      status: data.status as AppointmentStatus,
      rescheduleHistory: data.reschedule_history || [],
    }
  },

  async rescheduleAppointment(
    id: string,
    newDate: Date,
    newTime: string,
  ): Promise<Appointment> {
    const { data: existingAppointment, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingAppointment) {
      console.error('Error fetching appointment to reschedule:', fetchError)
      throw fetchError || new Error('Appointment not found')
    }

    const historyEntry = {
      previousDate: existingAppointment.date,
      previousTime: existingAppointment.time,
      newDate: format(newDate, 'yyyy-MM-dd'),
      newTime: newTime,
      changedAt: new Date().toISOString(),
    }

    const newHistory = [
      ...(existingAppointment.reschedule_history || []),
      historyEntry,
    ]

    const { data, error } = await supabase
      .from('appointments')
      .update({
        date: format(newDate, 'yyyy-MM-dd'),
        time: newTime,
        status: 'Remarcada',
        reschedule_history: newHistory,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error rescheduling appointment:', error)
      throw error
    }
    return {
      id: data.id,
      date: data.date,
      time: data.time,
      patient: data.patient_name,
      service: data.service_name,
      professional: data.professional_name,
      status: data.status as AppointmentStatus,
      rescheduleHistory: data.reschedule_history || [],
    }
  },
}
