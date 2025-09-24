import { supabase } from '@/lib/supabase/client'

export interface ContactInquiry {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export const contactService = {
  async submitInquiry(inquiryData: ContactInquiry): Promise<void> {
    const { error } = await supabase
      .from('contact_inquiries')
      .insert([inquiryData])

    if (error) {
      console.error('Error submitting contact inquiry:', error)
      throw error
    }
  },
}
