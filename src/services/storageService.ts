import { supabase } from '@/lib/supabase/client'

export const storageService = {
  async uploadImage(file: File, bucket: 'imagens'): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      throw new Error('Falha no upload da imagem.')
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

    if (!data.publicUrl) {
      throw new Error('Não foi possível obter a URL pública da imagem.')
    }

    return data.publicUrl
  },
}
