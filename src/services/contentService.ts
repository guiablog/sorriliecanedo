import { supabase } from '@/lib/supabase/client'
import { ContentItem } from '@/stores/content'

export const contentService = {
  async getAllContent(): Promise<ContentItem[]> {
    const { data, error } = await supabase.from('content').select('*')
    if (error) {
      console.error('Error fetching content:', error)
      throw error
    }
    return data.map((c) => ({
      id: c.id,
      type: c.type as ContentItem['type'],
      title: c.title,
      content: c.content,
      publishedDate: c.published_date,
      status: c.status as ContentItem['status'],
      image_url: c.image_url,
    }))
  },

  async addContent(contentData: Omit<ContentItem, 'id'>): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content')
      .insert({
        type: contentData.type,
        title: contentData.title,
        content: contentData.content,
        published_date: contentData.publishedDate,
        status: contentData.status,
        image_url: contentData.image_url,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding content:', error)
      throw error
    }
    return {
      id: data.id,
      type: data.type as ContentItem['type'],
      title: data.title,
      content: data.content,
      publishedDate: data.published_date,
      status: data.status as ContentItem['status'],
      image_url: data.image_url,
    }
  },

  async updateContent(contentData: ContentItem): Promise<ContentItem> {
    const { id, ...updateData } = contentData
    const { data, error } = await supabase
      .from('content')
      .update({
        type: updateData.type,
        title: updateData.title,
        content: updateData.content,
        published_date: updateData.publishedDate,
        status: updateData.status,
        image_url: updateData.image_url,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating content:', error)
      throw error
    }
    return {
      id: data.id,
      type: data.type as ContentItem['type'],
      title: data.title,
      content: data.content,
      publishedDate: data.published_date,
      status: data.status as ContentItem['status'],
      image_url: data.image_url,
    }
  },

  async deleteContent(id: string): Promise<void> {
    const { error } = await supabase.from('content').delete().eq('id', id)
    if (error) {
      console.error('Error deleting content:', error)
      throw error
    }
  },
}
