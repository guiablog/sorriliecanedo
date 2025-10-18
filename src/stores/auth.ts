import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { adminUserService } from '@/services/adminUserService'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/components/ui/use-toast'

interface AuthState {
  isAuthenticated: boolean
  userType: 'patient' | 'admin' | null
  userId: string | null
  name: string | null
  adminUser: { name: string; email: string } | null
  loading: boolean
  patientLogin: (email: string, pass: string) => Promise<boolean | string>
  adminLogin: (email: string, pass: string) => Promise<boolean | string>
  signInWithGoogle: () => Promise<boolean | string>
  logout: () => void
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userType: null,
      userId: null,
      name: null,
      adminUser: null,
      loading: true,
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
          userId: authData.user.id,
          name: patientProfile.name,
          adminUser: null,
          loading: false,
        })
        return true
      },
      adminLogin: async (email, password) => {
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          })

        if (authError || !authData.user) {
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
            userId: authData.user.id,
            adminUser: { name: adminProfile.name, email: adminProfile.email },
            name: null,
            loading: false,
          })
          return true
        } catch (profileError) {
          await supabase.auth.signOut()
          return 'Erro ao verificar o perfil do usuário.'
        }
      },
      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        })
        if (error) {
          console.error('Google sign-in error:', error.message)
          toast({
            title: 'Erro com Google',
            description: 'Não foi possível iniciar o login com Google.',
            variant: 'destructive',
          })
          return error.message
        }
        return true
      },
      logout: () => {
        supabase.auth.signOut()
        set({
          isAuthenticated: false,
          userType: null,
          userId: null,
          name: null,
          adminUser: null,
          loading: false,
        })
      },
      checkSession: async () => {
        set({ loading: true })
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          set({
            isAuthenticated: false,
            userType: null,
            userId: null,
            name: null,
            adminUser: null,
            loading: false,
          })
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
            userId: user.id,
            adminUser: { name: adminProfile.name, email: adminProfile.email },
            loading: false,
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
              userId: user.id,
              name: patientProfile.name,
              loading: false,
            })
          } else {
            if (session && !patientProfile && !adminProfile) {
              setTimeout(() => get().checkSession(), 1500)
            } else {
              get().logout()
            }
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
