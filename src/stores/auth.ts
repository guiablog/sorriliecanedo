import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { adminUserService } from '@/services/adminUserService'
import { supabase } from '@/lib/supabase/client'

interface AuthState {
  isAuthenticated: boolean
  userType: 'patient' | 'admin' | null
  name: string | null
  adminUser: { name: string; email: string } | null
  patientLogin: (name: string) => void
  adminLogin: (email: string, pass: string) => Promise<boolean | string>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userType: null,
      name: null,
      adminUser: null,
      patientLogin: (name) =>
        set({
          isAuthenticated: true,
          userType: 'patient',
          name: name,
          adminUser: null,
        }),
      adminLogin: async (email, password) => {
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })

        if (authError) {
          console.error('Supabase sign-in error:', authError.message)
          return 'Credenciais inválidas'
        }

        if (!authData.user) {
          return 'Credenciais inválidas'
        }

        try {
          const adminProfile = await adminUserService.getAdminUserByUserId(
            authData.user.id,
          )

          if (!adminProfile) {
            await supabase.auth.signOut()
            return 'Perfil de administrador não encontrado.'
          }

          if (adminProfile.status !== 'active') {
            await supabase.auth.signOut()
            return 'Usuário inativo'
          }

          set({
            isAuthenticated: true,
            userType: 'admin',
            adminUser: { name: adminProfile.name, email: adminProfile.email },
            name: null,
          })
          return true
        } catch (profileError) {
          console.error('Error fetching admin profile:', profileError)
          await supabase.auth.signOut()
          return 'Erro ao verificar o perfil do usuário.'
        }
      },
      logout: () => {
        supabase.auth.signOut()
        set({
          isAuthenticated: false,
          userType: null,
          name: null,
          adminUser: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
