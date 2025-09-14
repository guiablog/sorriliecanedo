import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  userType: 'patient' | 'admin' | null
  login: (userType: 'patient' | 'admin') => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userType: null,
      login: (userType) => set({ isAuthenticated: true, userType }),
      logout: () => set({ isAuthenticated: false, userType: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
