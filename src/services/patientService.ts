import { supabase } from '@/lib/supabase/client'
import { Patient } from '@/stores/patient'

type AddPatientPayload = {
  name: string
  cpf: string
  whatsapp: string
  email: string
  password?: string
}

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    const { data, error } = await supabase.from('patients').select('*')
    if (error) {
      console.error('Error fetching patients:', error)
      throw error
    }
    return data.map((p) => ({
      name: p.name,
      cpf: p.cpf,
      whatsapp: p.whatsapp,
      email: p.email,
      password: p.password || undefined,
      registered: p.created_at, // Return ISO string
      status: p.status as Patient['status'],
    }))
  },

  async addPatient(patientData: AddPatientPayload): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert({
        name: patientData.name,
        cpf: patientData.cpf,
        whatsapp: patientData.whatsapp,
        email: patientData.email,
        password: patientData.password,
        status: 'Ativo',
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding patient:', error)
      throw error
    }

    return {
      name: data.name,
      cpf: data.cpf,
      whatsapp: data.whatsapp,
      email: data.email,
      password: data.password || undefined,
      registered: data.created_at,
      status: data.status as Patient['status'],
    }
  },

  async updatePatient(
    cpf: string,
    patientData: Partial<Omit<Patient, 'registered'>>,
  ): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('cpf', cpf)
      .select()
      .single()

    if (error) {
      console.error('Error updating patient:', error)
      throw error
    }

    return {
      name: data.name,
      cpf: data.cpf,
      whatsapp: data.whatsapp,
      email: data.email,
      password: data.password || undefined,
      registered: data.created_at,
      status: data.status as Patient['status'],
    }
  },

  async deletePatient(cpf: string): Promise<void> {
    const { error } = await supabase.from('patients').delete().eq('cpf', cpf)
    if (error) {
      console.error('Error deleting patient:', error)
      throw error
    }
  },
}
