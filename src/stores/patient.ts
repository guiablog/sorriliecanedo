import { create } from 'zustand'
import { patientService } from '@/services/patientService'
import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Tables } from '@/lib/supabase/types'

export interface Patient {
  id: string
  user_id: string | null
  name: string
  whatsapp: string | null
  email: string
  registered: string
  status: 'Ativo' | 'Inativo' | 'Pendente de Verificação'
}

const mapRowToPatient = (row: Tables<'patients'>): Patient => ({
  id: row.id,
  user_id: row.user_id,
  name: row.name,
  whatsapp: row.whatsapp,
  email: row.email,
  registered: row.created_at,
  status: row.status as Patient['status'],
})

interface PatientState {
  patients: Patient[]
  loading: boolean
  emailForPasswordReset: string | null
  channel: RealtimeChannel | null
  fetchPatients: () => Promise<void>
  setEmailForPasswordReset: (email: string | null) => void
  updatePatient: (
    userId: string,
    data: Partial<Omit<Patient, 'registered' | 'id' | 'user_id'>>,
  ) => Promise<void>
  deletePatient: (userId: string) => Promise<void>
  subscribe: () => void
  unsubscribe: () => void
}

export const usePatientStore = create<PatientState>()((set, get) => ({
  patients: [],
  loading: true,
  emailForPasswordReset: null,
  channel: null,
  fetchPatients: async () => {
    set({ loading: true })
    try {
      const patients = await patientService.getAllPatients()
      set({ patients, loading: false })
    } catch (error) {
      console.error('Failed to fetch patients', error)
      set({ loading: false })
    }
  },
  setEmailForPasswordReset: (email) => set({ emailForPasswordReset: email }),
  updatePatient: async (userId, data) => {
    const updatedPatient = await patientService.updatePatient(userId, data)
    set((state) => ({
      patients: state.patients.map((p) =>
        p.user_id === userId ? { ...p, ...updatedPatient } : p,
      ),
    }))
  },
  deletePatient: async (userId) => {
    await patientService.deletePatient(userId)
    set((state) => ({
      patients: state.patients.filter((p) => p.user_id !== userId),
    }))
  },
  subscribe: () => {
    if (get().channel) {
      return
    }
    const channel = supabase
      .channel('patients-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patients' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT': {
              const newPatient = mapRowToPatient(
                payload.new as Tables<'patients'>,
              )
              set((state) => ({ patients: [...state.patients, newPatient] }))
              break
            }
            case 'UPDATE': {
              const updatedPatient = mapRowToPatient(
                payload.new as Tables<'patients'>,
              )
              set((state) => ({
                patients: state.patients.map((p) =>
                  p.id === updatedPatient.id ? updatedPatient : p,
                ),
              }))
              break
            }
            case 'DELETE': {
              const oldPatient = payload.old as Partial<Tables<'patients'>>
              if (oldPatient.id) {
                set((state) => ({
                  patients: state.patients.filter(
                    (p) => p.id !== oldPatient.id,
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
