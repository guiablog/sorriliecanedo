import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface Professional {
  id: string
  name: string
  specialty: string
  cro: string
  status: 'Ativo' | 'Inativo'
}

interface ProfessionalState {
  professionals: Professional[]
  addProfessional: (professional: Omit<Professional, 'id'>) => void
  updateProfessional: (professional: Professional) => void
  deleteProfessional: (id: string) => void
}

const initialProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Ricardo Alves',
    specialty: 'Clínico Geral',
    cro: 'SP-12345',
    status: 'Ativo',
  },
  {
    id: '2',
    name: 'Dra. Ana Costa',
    specialty: 'Ortodontista',
    cro: 'RJ-54321',
    status: 'Ativo',
  },
]

export const useProfessionalStore = create<ProfessionalState>()(
  persist(
    (set) => ({
      professionals: initialProfessionals,
      addProfessional: (professional) =>
        set((state) => ({
          professionals: [
            ...state.professionals,
            { ...professional, id: crypto.randomUUID() },
          ],
        })),
      updateProfessional: (updatedProfessional) =>
        set((state) => ({
          professionals: state.professionals.map((p) =>
            p.id === updatedProfessional.id ? updatedProfessional : p,
          ),
        })),
      deleteProfessional: (id) =>
        set((state) => ({
          professionals: state.professionals.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'professional-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
