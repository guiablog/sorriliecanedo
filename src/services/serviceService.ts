import { supabase } from '@/lib/supabase/client'
import { Service } from '@/stores/service'

export const serviceService = {
  async getAllServices(): Promise<Service[]> {
    const { data, error } = await supabase.from('services').select('*')
    if (error) {
      console.error('Error fetching services:', error)
      throw error
    }
    return data.map((s) => ({
      id: s.id,
      name: s.name,
      duration: s.duration,
      status: s.status as Service['status'],
    }))
  },

  async addService(serviceData: Omit<Service, 'id'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(serviceData)
      .select()
      .single()

    if (error) {
      console.error('Error adding service:', error)
      throw error
    }
    return {
      id: data.id,
      name: data.name,
      duration: data.duration,
      status: data.status as Service['status'],
    }
  },

  async updateService(serviceData: Service): Promise<Service> {
    const { id, ...updateData } = serviceData
    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating service:', error)
      throw error
    }
    return {
      id: data.id,
      name: data.name,
      duration: data.duration,
      status: data.status as Service['status'],
    }
  },

  async deleteService(id: string): Promise<void> {
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  },
}
