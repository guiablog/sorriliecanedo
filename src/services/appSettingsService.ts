import { supabase } from '@/lib/supabase/client'

export interface AppSettings {
  id: number
  logo_url: string | null
  whatsapp_contact: string | null
  splash_screen_image_url: string | null
  whatsapp_button_enabled: boolean | null
  whatsapp_icon_url: string | null
}

const formatWhatsappNumber = (
  number: string | null | undefined,
): string | null => {
  if (!number) return null
  let digits = number.replace(/\D/g, '')
  if (digits.length > 0 && !digits.startsWith('55')) {
    digits = '55' + digits
  }
  return digits
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
    const settingsToUpdate = { ...settings }
    if (typeof settingsToUpdate.whatsapp_contact === 'string') {
      settingsToUpdate.whatsapp_contact = formatWhatsappNumber(
        settingsToUpdate.whatsapp_contact,
      )
    }

    const { data, error } = await supabase
      .from('app_settings')
      .upsert({ id: 1, ...settingsToUpdate }, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Error updating app settings:', error)
      throw error
    }
    return data
  },
}
