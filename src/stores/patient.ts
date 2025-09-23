import { create } from 'zustand'
import { patientService } from '@/services/patientService'

export interface Patient {
  user_id: string | null
  name: string
  cpf: string
  whatsapp: string
  email: string
  registered: string
  status: 'Ativo' | 'Inativo' | 'Pendente de Verificação'
}

interface PatientState {
  patients: Patient[]
  loading: boolean
  emailForPasswordReset: string | null
  fetchPatients: () => Promise<void>
  setEmailForPasswordReset: (email: string | null) => void
  updatePatient: (
    originalCpf: string,
    data: Partial<Omit<Patient, 'registered' | 'cpf'>>,
  ) => Promise<void>
  deletePatient: (cpf: string) => Promise<void>
}

export const usePatientStore = create<PatientState>()((set) => ({
  patients: [],
  loading: true,
  emailForPasswordReset: null,
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
}))
