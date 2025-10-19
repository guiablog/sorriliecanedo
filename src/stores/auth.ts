import { create } from 'zustand'
import { adminUserService } from '@/services/adminUserService'
import { supabase } from '@/lib/supabase/client'
import { patientService } from '@/services/patientService'
import { toast } from '@/components/ui/use-toast'

interface AuthState {
  isAuthenticated: boolean
  userType: 'patient' | 'admin' | null
  userId: string | null
  name: string | null
  adminUser: { name: string; email: string } | null
  loading: boolean
  initializeAuthListener: () => () => void
  patientLogin: (email: string, pass: string) => Promise<boolean | string>
  adminLogin: (email: string, pass: string) => Promise<boolean | string>
  signInWithGoogle: () => Promise<boolean | string>
  logout: () => Promise<void>
}

const handleAuthError = async (message: string) => {
  toast({
    title: 'Erro de Autenticação',
    description: message,
    variant: 'destructive',
  })
  await supabase.auth.signOut()
  // The onAuthStateChange will trigger a state update to unauthenticated
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userType: null,
  userId: null,
  name: null,
  adminUser: null,
  loading: true,

  initializeAuthListener: () => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
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

      const userId = session.user.id
      let userFound = false

      // 1. Check for Admin profile
      try {
        const adminProfile = await adminUserService.getAdminUserByUserId(userId)
        if (adminProfile) {
          if (adminProfile.status === 'active') {
            set({
              isAuthenticated: true,
              userId,
              userType: 'admin',
              name: adminProfile.name,
              adminUser: {
                name: adminProfile.name,
                email: adminProfile.email,
              },
              loading: false,
            })
            userFound = true
          } else {
            await handleAuthError(
              'Sua conta de administrador está inativa. Contate o suporte.',
            )
            userFound = true // Found but invalid, stop processing
          }
        }
      } catch (error) {
        console.error('Error checking for admin profile:', error)
        // Continue to check for patient profile
      }

      if (userFound) return

      // 2. Check for Patient profile
      try {
        const patientProfile = await patientService.getPatientByUserId(userId)
        if (patientProfile) {
          if (patientProfile.status === 'Ativo') {
            set({
              isAuthenticated: true,
              userId,
              userType: 'patient',
              name: patientProfile.name,
              adminUser: null,
              loading: false,
            })
            userFound = true
          } else {
            await handleAuthError(
              `Seu perfil de paciente está com status "${patientProfile.status}". Contate o suporte.`,
            )
            userFound = true // Found but invalid, stop processing
          }
        }
      } catch (error) {
        console.error('Error checking for patient profile:', error)
        // Continue to final error handling
      }

      if (userFound) return

      // 3. If no valid profile is found after a short delay (for trigger to run)
      setTimeout(async () => {
        // Re-check patient profile in case of replication lag
        try {
          const patientProfile = await patientService.getPatientByUserId(userId)
          if (patientProfile && patientProfile.status === 'Ativo') {
            set({
              isAuthenticated: true,
              userId,
              userType: 'patient',
              name: patientProfile.name,
              adminUser: null,
              loading: false,
            })
            return
          }
        } catch (error) {
          // Ignore error, proceed to final failure case
        }

        // Final failure case
        await handleAuthError(
          'Não foi possível carregar seu perfil. Por favor, tente novamente ou contate o suporte.',
        )
      }, 1000) // Wait 1 second for db trigger
    })

    return () => {
      subscription.unsubscribe()
    }
  },

  patientLogin: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Patient sign-in error:', error.message)
      return 'Credenciais inválidas.'
    }
    return true
  },

  adminLogin: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Admin sign-in error:', error.message)
      return 'Credenciais inválidas.'
    }
    return true
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
      return error.message
    }
    return true
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({
      isAuthenticated: false,
      userType: null,
      userId: null,
      name: null,
      adminUser: null,
    })
  },
}))
