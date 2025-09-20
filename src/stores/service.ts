import { create } from 'zustand'
import { serviceService } from '@/services/serviceService'

export interface Service {
  id: string
  name: string
  duration: string
  status: 'Ativo' | 'Inativo'
}

interface ServiceState {
  services: Service[]
  loading: boolean
  fetchServices: () => Promise<void>
  addService: (service: Omit<Service, 'id'>) => Promise<void>
  updateService: (service: Service) => Promise<void>
  deleteService: (id: string) => Promise<void>
}

export const useServiceStore = create<ServiceState>()((set) => ({
  services: [],
  loading: true,
  fetchServices: async () => {
    set({ loading: true })
    try {
      const services = await serviceService.getAllServices()
      set({ services, loading: false })
    } catch (error) {
      console.error('Failed to fetch services', error)
      set({ loading: false })
    }
  },
  addService: async (service) => {
    const newService = await serviceService.addService(service)
    set((state) => ({
      services: [...state.services, newService],
    }))
  },
  updateService: async (updatedService) => {
    const newService = await serviceService.updateService(updatedService)
    set((state) => ({
      services: state.services.map((s) =>
        s.id === newService.id ? newService : s,
      ),
    }))
  },
  deleteService: async (id) => {
    await serviceService.deleteService(id)
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    }))
  },
}))
