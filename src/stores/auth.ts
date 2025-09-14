import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  userType: 'patient' | 'admin' | null
  fullName: string | null
  login: (userType: 'patient' | 'admin', fullName?: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userType: null,
      fullName: null,
      login: (userType, fullName) =>
        set({
          isAuthenticated: true,
          userType,
          fullName: fullName || null,
        }),
      logout: () =>
        set({ isAuthenticated: false, userType: null, fullName: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
