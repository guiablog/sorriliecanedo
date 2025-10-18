import { supabase } from '@/lib/supabase/client'
import { Patient } from '@/stores/patient'

type PatientSignUpPayload = {
  name: string
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
      id: p.id,
      user_id: p.user_id,
      name: p.name,
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
          whatsapp: patientData.whatsapp,
        },
      },
    })
    return { user: data.user, error }
  },

  async updatePatient(
    userId: string,
    patientData: Partial<Omit<Patient, 'registered' | 'id' | 'user_id'>>,
  ): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating patient:', error)
      throw error
    }

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      registered: data.created_at,
      status: data.status as Patient['status'],
    }
  },

  async deletePatient(userId: string): Promise<void> {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('user_id', userId)
    if (error) {
      console.error('Error deleting patient:', error)
      throw error
    }
  },

  async getPatientByUserId(userId: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching patient by user ID:', error)
      throw error
    }
    if (!data) return null

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      registered: data.created_at,
      status: data.status as Patient['status'],
    }
  },
}
