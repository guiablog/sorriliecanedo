import { create } from 'zustand'
import { patientService } from '@/services/patientService'

export interface Patient {
  name: string
  cpf: string
  whatsapp: string
  email: string
  registered: string
  status: 'Ativo' | 'Inativo' | 'Pendente de Verificação'
  password?: string
}

interface PatientState {
  patients: Patient[]
  loading: boolean
  emailForPasswordReset: string | null
  fetchPatients: () => Promise<void>
  setEmailForPasswordReset: (email: string | null) => void
  addPatient: (patient: {
    fullName: string
    cpf: string
    whatsapp: string
    email: string
    password?: string
  }) => Promise<void>
  updatePatient: (
    originalCpf: string,
    data: Partial<Omit<Patient, 'registered'>>,
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
  addPatient: async (patientData) => {
    const newPatient = await patientService.addPatient(patientData)
    set((state) => ({ patients: [...state.patients, newPatient] }))
  },
  updatePatient: async (originalCpf, data) => {
    const updatedPatient = await patientService.updatePatient(originalCpf, data)
    set((state) => ({
      patients: state.patients.map((p) =>
        p.cpf === originalCpf ? { ...updatedPatient, ...data } : p,
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
