import { create } from 'zustand'
import { contentService } from '@/services/contentService'

export type ContentType = 'tip' | 'news' | 'health_focus' | 'publication'

export interface ContentItem {
  id: string
  type: ContentType
  title: string
  content: string
  publishedDate: string // YYYY-MM-DD
  status: 'Publicado' | 'Rascunho'
  image_url?: string | null
}

interface ContentState {
  content: ContentItem[]
  loading: boolean
  fetchContent: () => Promise<void>
  addContent: (item: Omit<ContentItem, 'id'>) => Promise<void>
  updateContent: (item: ContentItem) => Promise<void>
  deleteContent: (id: string) => Promise<void>
}

export const useContentStore = create<ContentState>()((set) => ({
  content: [],
  loading: true,
  fetchContent: async () => {
    set({ loading: true })
    try {
      const content = await contentService.getAllContent()
      set({ content, loading: false })
    } catch (error) {
      console.error('Failed to fetch content', error)
      set({ loading: false })
    }
  },
  addContent: async (item) => {
    const newItem = await contentService.addContent(item)
    set((state) => ({
      content: [...state.content, newItem],
    }))
  },
  updateContent: async (updatedItem) => {
    const newItem = await contentService.updateContent(updatedItem)
    set((state) => ({
      content: state.content.map((item) =>
        item.id === newItem.id ? newItem : item,
      ),
    }))
  },
  deleteContent: async (id) => {
    await contentService.deleteContent(id)
    set((state) => ({
      content: state.content.filter((item) => item.id !== id),
    }))
  },
}))
