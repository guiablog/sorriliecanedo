import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { adminUserService } from '@/services/adminUserService'
import { supabase } from '@/lib/supabase/client'

interface AuthState {
  isAuthenticated: boolean
  userType: 'patient' | 'admin' | null
  name: string | null
  adminUser: { name: string; email: string } | null
  patientLogin: (email: string, pass: string) => Promise<boolean | string>
  adminLogin: (email: string, pass: string) => Promise<boolean | string>
  logout: () => void
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userType: null,
      name: null,
      adminUser: null,
      patientLogin: async (email, password) => {
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })

        if (authError || !authData.user) {
          console.error('Patient sign-in error:', authError?.message)
          return 'Credenciais inválidas.'
        }

        const { data: patientProfile, error: profileError } = await supabase
          .from('patients')
          .select('name, status')
          .eq('user_id', authData.user.id)
          .single()

        if (profileError || !patientProfile) {
          await supabase.auth.signOut()
          return 'Perfil de paciente não encontrado.'
        }

        if (patientProfile.status !== 'Ativo') {
          await supabase.auth.signOut()
          return `Sua conta está com status: ${patientProfile.status}.`
        }

        set({
          isAuthenticated: true,
          userType: 'patient',
          name: patientProfile.name,
          adminUser: null,
        })
        return true
      },
      adminLogin: async (email, password) => {
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })

        if (authError) {
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
      checkSession: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          get().logout()
          return
        }

        const user = session.user
        const { data: adminProfile } = await supabase
          .from('admin_users')
          .select('name, email, status')
          .eq('user_id', user.id)
          .single()

        if (adminProfile && adminProfile.status === 'active') {
          set({
            isAuthenticated: true,
            userType: 'admin',
            adminUser: { name: adminProfile.name, email: adminProfile.email },
          })
        } else {
          const { data: patientProfile } = await supabase
            .from('patients')
            .select('name, status')
            .eq('user_id', user.id)
            .single()

          if (patientProfile && patientProfile.status === 'Ativo') {
            set({
              isAuthenticated: true,
              userType: 'patient',
              name: patientProfile.name,
            })
          } else {
            get().logout()
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
