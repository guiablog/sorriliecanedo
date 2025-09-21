import { supabase } from '@/lib/supabase/client'
import { AdminUser } from '@/types/admin'

type AdminUserCreationPayload = {
  name: string
  email: string
  password: string
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

  async getAdminUsersCount(): Promise<number> {
    const { count, error } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error fetching admin users count:', error)
      throw error
    }
    return count || 0
  },

  async getAdminUserByUserId(userId: string) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching admin user by user_id:', error)
      throw error
    }
    return data
  },

  async createAdminUser(
    userData: AdminUserCreationPayload,
  ): Promise<AdminUser> {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    })

    if (error) {
      console.error('Error signing up admin user:', error)
      throw error
    }

    if (!data.user) {
      throw new Error('User not created')
    }

    return {
      id: data.user.id,
      name: data.user.user_metadata.name,
      email: data.user.email ?? '',
      status: 'active',
      created_at: data.user.created_at ?? new Date().toISOString(),
    }
  },
}
