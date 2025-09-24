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
      user_id: u.user_id,
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
          role: 'admin',
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

    // The trigger will create the profile, but we return a representation of it
    return {
      id: data.user.id, // This is a placeholder, the real one is in the table
      user_id: data.user.id,
      name: data.user.user_metadata.name,
      email: data.user.email ?? '',
      status: 'active',
      created_at: data.user.created_at ?? new Date().toISOString(),
    }
  },

  async updateAdminUser(
    userId: string,
    userData: { name: string; email: string; status: 'active' | 'inactive' },
  ): Promise<AdminUser> {
    const { error: rpcError } = await supabase.rpc('update_admin_user', {
      user_id_to_update: userId,
      new_email: userData.email,
      new_name: userData.name,
    })

    if (rpcError) {
      console.error('Error updating user in auth via RPC:', rpcError)
      throw rpcError
    }

    const { data, error } = await supabase
      .from('admin_users')
      .update({
        name: userData.name,
        email: userData.email,
        status: userData.status,
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating admin user profile:', error)
      throw error
    }

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      email: data.email,
      status: data.status as 'active' | 'inactive',
      created_at: data.created_at,
    }
  },

  async deleteAdminUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc('delete_user', {
      user_id_to_delete: userId,
    })

    if (error) {
      console.error('Error deleting admin user via RPC:', error)
      throw error
    }
  },
}
