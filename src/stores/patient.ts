import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface Patient {
  name: string
  cpf: string
  whatsapp: string
  email: string
  registered: string
  status: 'Ativo' | 'Inativo' | 'Pendente de Verificação'
}

interface PatientState {
  patients: Patient[]
  addPatient: (patient: Omit<Patient, 'registered' | 'status'>) => void
}

const initialPatients: Patient[] = [
  {
    name: 'Maria da Silva',
    cpf: '123.456.789-00',
    whatsapp: '(11) 98765-4321',
    email: 'maria@email.com',
    registered: '10/09/2025',
    status: 'Ativo',
  },
  {
    name: 'João Pereira',
    cpf: '987.654.321-00',
    whatsapp: '(21) 91234-5678',
    email: 'joao@email.com',
    registered: '05/09/2025',
    status: 'Ativo',
  },
  {
    name: 'Ana Costa',
    cpf: '111.222.333-44',
    whatsapp: '(31) 95555-4444',
    email: 'ana@email.com',
    registered: '01/09/2025',
    status: 'Inativo',
  },
]

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      patients: initialPatients,
      addPatient: (patientData) =>
        set((state) => {
          const newPatient: Patient = {
            name: patientData.fullName,
            cpf: patientData.cpf,
            whatsapp: patientData.whatsapp,
            email: patientData.email,
            registered: new Date().toLocaleDateString('pt-BR'),
            status: 'Ativo',
          }
          return { patients: [...state.patients, newPatient] }
        }),
    }),
    {
      name: 'patient-storage',
      storage: createJSONStorage(() => localStorage), // Use localStorage for cross-session persistence
    },
  ),
)
