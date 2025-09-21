import { supabase } from '@/lib/supabase/client'

const UPLOAD_FUNCTION_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/storage-upload`

export const storageService = {
  async uploadImage(file: File, bucket: 'imagens'): Promise<string> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('User is not authenticated.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)

    const response = await fetch(UPLOAD_FUNCTION_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload image.')
    }

    const { publicUrl } = await response.json()
    if (!publicUrl) {
      throw new Error('Failed to get public URL for the uploaded image.')
    }

    return publicUrl
  },
}
