import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useContentStore, ContentItem, ContentType } from '@/stores/content'
import { ContentForm, ContentFormValues } from '@/components/ContentForm'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminContentManagement() {
  const { content, addContent, updateContent, loading } = useContentStore()
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const [contentType, setContentType] = useState<ContentType>('tip')

  const tips = content.filter((c) => c.type === 'tip')
  const news = content.filter((c) => c.type === 'news')
  const publications = content.filter((c) => c.type === 'publication')

  const openModal = (
    type: ContentType,
    contentItem: ContentItem | null = null,
  ) => {
    setContentType(type)
    setEditingContent(contentItem)
    setModalOpen(true)
  }

  const handleFormSubmit = async (data: ContentFormValues) => {
    try {
      const payload = {
        ...data,
        publishedDate: format(data.published_date, 'yyyy-MM-dd'),
      }

      if (editingContent) {
        await updateContent({
          ...editingContent,
          ...payload,
        })
        toast({ title: 'Conteúdo atualizado com sucesso!' })
      } else {
        await addContent({
          ...payload,
          type: contentType,
        })
        toast({ title: 'Conteúdo adicionado com sucesso!' })
      }
      setEditingContent(null)
      setModalOpen(false)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o conteúdo.',
        variant: 'destructive',
      })
    }
  }

  const renderTableRows = (items: ContentItem[]) => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={3}>
            <Skeleton className="h-8 w-full" />
          </TableCell>
        </TableRow>
      ))
    }
    return items.map((item) => (
      <TableRow
        key={item.id}
        onClick={() => openModal(item.type, item)}
        className="cursor-pointer"
      >
        <TableCell>{item.title}</TableCell>
        <TableCell>
          {format(new Date(item.publishedDate), 'dd/MM/yyyy')}
        </TableCell>
        <TableCell>{item.status}</TableCell>
      </TableRow>
    ))
  }

  const getContentTypeLabel = (type: ContentType) => {
    const labels: Record<ContentType, string> = {
      tip: 'Dica',
      news: 'Novidade',
      publication: 'Publicação',
      promotion: 'Promoção',
      highlight: 'Destaque',
    }
    return labels[type] || 'Conteúdo'
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciamento de Conteúdos</h1>
      <Tabs defaultValue="tips">
        <TabsList>
          <TabsTrigger value="tips">Dicas de Saúde</TabsTrigger>
          <TabsTrigger value="news">Novidades</TabsTrigger>
          <TabsTrigger value="publications">Publicações</TabsTrigger>
        </TabsList>
        <TabsContent value="tips" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => openModal('tip')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Adicionar Dica
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Publicado em</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableRows(tips)}</TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="news" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => openModal('news')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Adicionar Novidade
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Publicado em</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableRows(news)}</TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="publications" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => openModal('publication')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Adicionar Publicação
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Publicado em</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableRows(publications)}</TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContent ? 'Editar' : 'Adicionar'}{' '}
              {getContentTypeLabel(contentType)}
            </DialogTitle>
          </DialogHeader>
          <ContentForm
            contentItem={editingContent}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setEditingContent(null)
              setModalOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
