import { create } from 'zustand'
import { appSettingsService, AppSettings } from '@/services/appSettingsService'

interface AppSettingsState {
  settings: AppSettings | null
  loading: boolean
  fetchAppSettings: () => Promise<void>
  updateAppSettings: (
    settings: Partial<Omit<AppSettings, 'id'>>,
  ) => Promise<void>
}

export const useAppSettingsStore = create<AppSettingsState>()((set) => ({
  settings: null,
  loading: true,
  fetchAppSettings: async () => {
    set({ loading: true })
    try {
      const settings = await appSettingsService.getAppSettings()
      set({ settings, loading: false })
    } catch (error) {
      console.error(
        'Failed to fetch app settings from Supabase. The application will proceed with default values. This might be due to a network issue, CORS policy, or a server error. Full error details:',
        error,
      )
      set({ loading: false }) // Keep settings as null, allowing the app to use fallbacks
    }
  },
  updateAppSettings: async (settings) => {
    const updatedSettings = await appSettingsService.updateAppSettings(settings)
    set({ settings: updatedSettings })
  },
}))
