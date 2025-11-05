import { create } from 'zustand'
import { adminUserService } from '@/services/adminUserService'
import { supabase } from '@/lib/supabase/client'
import { patientService } from '@/services/patientService'
import { toast } from '@/components/ui/use-toast'
import type { Session } from '@supabase/supabase-js'

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
  // onAuthStateChange will then set the unauthenticated state
}

const resolveUserSession = async (
  session: Session | null,
  set: (partial: Partial<AuthState>) => void,
) => {
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

  // Check for Admin profile
  try {
    const adminProfile = await adminUserService.getAdminUserByUserId(userId)
    if (adminProfile) {
      if (adminProfile.status === 'active') {
        set({
          isAuthenticated: true,
          userId,
          userType: 'admin',
          name: adminProfile.name,
          adminUser: { name: adminProfile.name, email: adminProfile.email },
          loading: false,
        })
      } else {
        await handleAuthError(
          'Sua conta de administrador está inativa. Contate o suporte.',
        )
      }
      return // Found admin, stop here
    }
  } catch (error) {
    console.error('Error checking for admin profile:', error)
  }

  // Check for Patient profile
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
      } else {
        await handleAuthError(
          `Seu perfil de paciente está com status "${patientProfile.status}". Contate o suporte.`,
        )
      }
      return // Found patient, stop here
    }
  } catch (error) {
    console.error('Error checking for patient profile:', error)
  }

  // If no profile is found, it might be a new user whose profile hasn't been created by the trigger yet.
  // Let's wait a bit and re-check.
  setTimeout(async () => {
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

    // Final failure case if still no profile
    await handleAuthError(
      'Não foi possível carregar seu perfil. Por favor, tente novamente ou contate o suporte.',
    )
  }, 1500)
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userType: null,
  userId: null,
  name: null,
  adminUser: null,
  loading: true,

  initializeAuthListener: () => {
    // Set up listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveUserSession(session, set)
    })

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolveUserSession(session, set)
    })

    return () => {
      subscription.unsubscribe()
    }
  },

  patientLogin: async (email, password) => {
    set({ loading: true })
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Patient sign-in error:', error.message)
      set({ loading: false })
      return 'Credenciais inválidas.'
    }
    // onAuthStateChange will handle the rest
    return true
  },

  adminLogin: async (email, password) => {
    set({ loading: true })
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Admin sign-in error:', error.message)
      set({ loading: false })
      return 'Credenciais inválidas.'
    }
    // onAuthStateChange will handle the rest
    return true
  },

  signInWithGoogle: async () => {
    set({ loading: true })
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) {
      console.error('Google sign-in error:', error.message)
      set({ loading: false })
      return error.message
    }
    return true
  },

  logout: async () => {
    await supabase.auth.signOut()
    // onAuthStateChange will handle setting the state to unauthenticated
  },
}))
