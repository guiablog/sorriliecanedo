import { create } from 'zustand'
import { adminUserService } from '@/services/adminUserService'
import { supabase } from '@/lib/supabase/client'
import { patientService } from '@/services/patientService'

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
      if (session?.user) {
        const userId = session.user.id
        let userType: 'admin' | 'patient' | null = null
        let name: string | null = null
        let adminUser: { name: string; email: string } | null = null

        const adminProfile = await adminUserService.getAdminUserByUserId(userId)
        if (adminProfile && adminProfile.status === 'active') {
          userType = 'admin'
          adminUser = {
            name: adminProfile.name,
            email: adminProfile.email,
          }
        } else {
          const patientProfile = await patientService.getPatientByUserId(userId)
          if (patientProfile && patientProfile.status === 'Ativo') {
            userType = 'patient'
            name = patientProfile.name
          }
        }

        if (userType) {
          set({
            isAuthenticated: true,
            userId,
            userType,
            name,
            adminUser,
            loading: false,
          })
        } else {
          await supabase.auth.signOut()
          set({
            isAuthenticated: false,
            userType: null,
            userId: null,
            name: null,
            adminUser: null,
            loading: false,
          })
        }
      } else {
        set({
          isAuthenticated: false,
          userType: null,
          userId: null,
          name: null,
          adminUser: null,
          loading: false,
        })
      }
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
