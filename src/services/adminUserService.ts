import { supabase } from '@/lib/supabase/client'
import { AdminUser } from '@/types/admin'

type AdminUserCreationPayload = {
  name: string
  email: string
  password?: string
}

export const adminUserService = {
  async getAllAdminUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase.from('admin_users').select('*')
    if (error) {
      console.error('Error fetching admin users:', error)
      throw error
    }
    return data.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      status: u.status as 'active' | 'inactive',
      created_at: u.created_at,
    }))
  },

  async getAdminUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116: "The result contains 0 rows"
      console.error('Error fetching admin user by email:', error)
      throw error
    }
    return data
  },

  async createAdminUser(
    userData: AdminUserCreationPayload,
  ): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        name: userData.name,
        email: userData.email,
        password: userData.password, // Storing plain text as per user story. NOT FOR PRODUCTION.
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating admin user:', error)
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      status: data.status as 'active' | 'inactive',
      created_at: data.created_at,
    }
  },
}
