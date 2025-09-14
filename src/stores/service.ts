import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface Service {
  id: string
  name: string
  duration: string
  status: 'Ativo' | 'Inativo'
}

interface ServiceState {
  services: Service[]
  addService: (service: Omit<Service, 'id'>) => void
  updateService: (service: Service) => void
  deleteService: (id: string) => void
}

const initialServices: Service[] = [
  {
    id: '1',
    name: 'Limpeza',
    duration: '45 min',
    status: 'Ativo',
  },
  {
    id: '2',
    name: 'Clareamento',
    duration: '90 min',
    status: 'Ativo',
  },
]

export const useServiceStore = create<ServiceState>()(
  persist(
    (set) => ({
      services: initialServices,
      addService: (service) =>
        set((state) => ({
          services: [
            ...state.services,
            { ...service, id: crypto.randomUUID() },
          ],
        })),
      updateService: (updatedService) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === updatedService.id ? updatedService : s,
          ),
        })),
      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'service-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
