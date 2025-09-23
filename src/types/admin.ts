export interface AdminUser {
  id: string
  user_id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  created_at: string
}

export interface AdminUserWithPassword extends AdminUser {
  password?: string
}
