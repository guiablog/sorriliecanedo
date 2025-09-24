import { create } from 'zustand'
import { patientService } from '@/services/patientService'
import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Tables } from '@/lib/supabase/types'

export interface Patient {
  user_id: string | null
  name: string
  cpf: string
  whatsapp: string
  email: string
  registered: string
  status: 'Ativo' | 'Inativo' | 'Pendente de Verificação'
}

const mapRowToPatient = (row: Tables<'patients'>): Patient => ({
  user_id: row.user_id,
  name: row.name,
  cpf: row.cpf,
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
    originalCpf: string,
    data: Partial<Omit<Patient, 'registered' | 'cpf'>>,
  ) => Promise<void>
  deletePatient: (cpf: string) => Promise<void>
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
  updatePatient: async (originalCpf, data) => {
    const updatedPatient = await patientService.updatePatient(originalCpf, data)
    set((state) => ({
      patients: state.patients.map((p) =>
        p.cpf === originalCpf ? { ...p, ...updatedPatient } : p,
      ),
    }))
  },
  deletePatient: async (cpf) => {
    await patientService.deletePatient(cpf)
    set((state) => ({
      patients: state.patients.filter((p) => p.cpf !== cpf),
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
                  p.cpf === updatedPatient.cpf ? updatedPatient : p,
                ),
              }))
              break
            }
            case 'DELETE': {
              const oldPatient = payload.old as Partial<Tables<'patients'>>
              if (oldPatient.cpf) {
                set((state) => ({
                  patients: state.patients.filter(
                    (p) => p.cpf !== oldPatient.cpf,
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
