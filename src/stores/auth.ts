import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { adminUserService } from '@/services/adminUserService'

interface AuthState {
  isAuthenticated: boolean
  userType: 'patient' | 'admin' | null
  fullName: string | null // For patient
  adminUser: { name: string; email: string } | null // For admin
  patientLogin: (fullName: string) => void
  adminLogin: (email: string, pass: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userType: null,
      fullName: null,
      adminUser: null,
      patientLogin: (fullName) =>
        set({
          isAuthenticated: true,
          userType: 'patient',
          fullName: fullName,
          adminUser: null,
        }),
      adminLogin: async (email, password) => {
        try {
          const user = await adminUserService.getAdminUserByEmail(email)
          if (user && user.password === password && user.status === 'active') {
            set({
              isAuthenticated: true,
              userType: 'admin',
              adminUser: { name: user.name, email: user.email },
              fullName: null,
            })
            return true
          }
          return false
        } catch (error) {
          console.error('Admin login failed:', error)
          return false
        }
      },
      logout: () =>
        set({
          isAuthenticated: false,
          userType: null,
          fullName: null,
          adminUser: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
