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
      console.error('Failed to fetch app settings', error)
      set({ loading: false })
    }
  },
  updateAppSettings: async (settings) => {
    const updatedSettings = await appSettingsService.updateAppSettings(settings)
    set({ settings: updatedSettings })
  },
}))
