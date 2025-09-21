import { create } from 'zustand'
import { professionalService } from '@/services/professionalService'

export interface Professional {
  id: string
  name: string
  specialty: string
  cro: string
  status: 'Ativo' | 'Inativo'
  photo_url?: string | null
}

interface ProfessionalState {
  professionals: Professional[]
  loading: boolean
  fetchProfessionals: () => Promise<void>
  addProfessional: (professional: Omit<Professional, 'id'>) => Promise<void>
  updateProfessional: (professional: Professional) => Promise<void>
  deleteProfessional: (id: string) => Promise<void>
}

export const useProfessionalStore = create<ProfessionalState>()((set) => ({
  professionals: [],
  loading: true,
  fetchProfessionals: async () => {
    set({ loading: true })
    try {
      const professionals = await professionalService.getAllProfessionals()
      set({ professionals, loading: false })
    } catch (error) {
      console.error('Failed to fetch professionals', error)
      set({ loading: false })
    }
  },
  addProfessional: async (professional) => {
    const newProfessional =
      await professionalService.addProfessional(professional)
    set((state) => ({
      professionals: [...state.professionals, newProfessional],
    }))
  },
  updateProfessional: async (updatedProfessional) => {
    const newProfessional =
      await professionalService.updateProfessional(updatedProfessional)
    set((state) => ({
      professionals: state.professionals.map((p) =>
        p.id === newProfessional.id ? newProfessional : p,
      ),
    }))
  },
  deleteProfessional: async (id) => {
    await professionalService.deleteProfessional(id)
    set((state) => ({
      professionals: state.professionals.filter((p) => p.id !== id),
    }))
  },
}))
