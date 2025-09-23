import { supabase } from '@/lib/supabase/client'
import { Patient } from '@/stores/patient'

type PatientSignUpPayload = {
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
      user_id: p.user_id,
      name: p.name,
      cpf: p.cpf,
      whatsapp: p.whatsapp,
      email: p.email,
      registered: p.created_at,
      status: p.status as Patient['status'],
    }))
  },

  async signUpPatient(
    patientData: PatientSignUpPayload,
  ): Promise<{ user: any; error: any }> {
    const { data, error } = await supabase.auth.signUp({
      email: patientData.email,
      password: patientData.password!,
      options: {
        data: {
          name: patientData.name,
          cpf: patientData.cpf,
          whatsapp: patientData.whatsapp,
        },
      },
    })
    return { user: data.user, error }
  },

  async updatePatient(
    cpf: string,
    patientData: Partial<Omit<Patient, 'registered' | 'cpf'>>,
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
      user_id: data.user_id,
      name: data.name,
      cpf: data.cpf,
      whatsapp: data.whatsapp,
      email: data.email,
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

  async getPatientByCpf(cpf: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('cpf', cpf)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching patient by CPF:', error)
      throw error
    }
    if (!data) return null

    return {
      user_id: data.user_id,
      name: data.name,
      cpf: data.cpf,
      whatsapp: data.whatsapp,
      email: data.email,
      registered: data.created_at,
      status: data.status as Patient['status'],
    }
  },
}
