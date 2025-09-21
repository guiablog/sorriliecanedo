import { supabase } from '@/lib/supabase/client'

export interface AppSettings {
  id: number
  logo_url: string | null
  whatsapp_contact: string | null
  splash_screen_image_url: string | null
}

export const appSettingsService = {
  async getAppSettings(): Promise<AppSettings | null> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('id', 1) // Assuming there's only one row for settings
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116: no rows found
      console.error('Error fetching app settings:', error)
      throw error
    }
    return data
  },

  async updateAppSettings(
    settings: Partial<Omit<AppSettings, 'id'>>,
  ): Promise<AppSettings> {
    const { data, error } = await supabase
      .from('app_settings')
      .upsert({ id: 1, ...settings }, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Error updating app settings:', error)
      throw error
    }
    return data
  },
}
