import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ContentType = 'tip' | 'news'

export interface ContentItem {
  id: string
  type: ContentType
  title: string
  content: string
  publishedDate: string // YYYY-MM-DD
  status: 'Publicado' | 'Rascunho'
}

interface ContentState {
  content: ContentItem[]
  addContent: (item: Omit<ContentItem, 'id'>) => void
  updateContent: (item: ContentItem) => void
  deleteContent: (id: string) => void
}

const initialContent: ContentItem[] = [
  {
    id: 'tip-1',
    type: 'tip',
    title: 'A Importância da Escovação Noturna',
    content:
      'Nunca durma sem escovar os dentes para evitar o acúmulo de placa e cáries. A produção de saliva diminui durante a noite, tornando a boca mais vulnerável a bactérias.',
    publishedDate: '2025-10-10',
    status: 'Publicado',
  },
  {
    id: 'tip-2',
    type: 'tip',
    title: 'Use o Fio Dental Diariamente',
    content:
      'O fio dental alcança onde a escova não chega, removendo restos de comida e placa bacteriana entre os dentes e sob a gengiva.',
    publishedDate: '2025-10-08',
    status: 'Publicado',
  },
  {
    id: 'news-1',
    type: 'news',
    title: 'Novas Tecnologias em Clareamento a Laser',
    content:
      'Conheça os avanços que tornam o clareamento dental mais rápido, seguro e com resultados mais duradouros. As novas tecnologias de laser minimizam a sensibilidade e maximizam o efeito branqueador.',
    publishedDate: '2025-10-05',
    status: 'Rascunho',
  },
]

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      content: initialContent,
      addContent: (item) =>
        set((state) => ({
          content: [
            ...state.content,
            { ...item, id: `${item.type}-${crypto.randomUUID()}` },
          ],
        })),
      updateContent: (updatedItem) =>
        set((state) => ({
          content: state.content.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        })),
      deleteContent: (id) =>
        set((state) => ({
          content: state.content.filter((item) => item.id !== id),
        })),
    }),
    {
      name: 'content-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
