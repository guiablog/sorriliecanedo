import { supabase } from '@/lib/supabase/client'
import { Professional } from '@/stores/professional'

export const professionalService = {
  async getAllProfessionals(): Promise<Professional[]> {
    const { data, error } = await supabase.from('professionals').select('*')
    if (error) {
      console.error('Error fetching professionals:', error)
      throw error
    }
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      specialty: p.specialty,
      cro: p.cro,
      status: p.status as Professional['status'],
      photo_url: p.photo_url,
    }))
  },

  async addProfessional(
    professionalData: Omit<Professional, 'id'>,
  ): Promise<Professional> {
    const { data, error } = await supabase
      .from('professionals')
      .insert(professionalData)
      .select()
      .single()

    if (error) {
      console.error('Error adding professional:', error)
      throw error
    }
    return {
      id: data.id,
      name: data.name,
      specialty: data.specialty,
      cro: data.cro,
      status: data.status as Professional['status'],
      photo_url: data.photo_url,
    }
  },

  async updateProfessional(
    professionalData: Professional,
  ): Promise<Professional> {
    const { id, ...updateData } = professionalData
    const { data, error } = await supabase
      .from('professionals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating professional:', error)
      throw error
    }
    return {
      id: data.id,
      name: data.name,
      specialty: data.specialty,
      cro: data.cro,
      status: data.status as Professional['status'],
      photo_url: data.photo_url,
    }
  },

  async deleteProfessional(id: string): Promise<void> {
    const { error } = await supabase.from('professionals').delete().eq('id', id)
    if (error) {
      console.error('Error deleting professional:', error)
      throw error
    }
  },
}
