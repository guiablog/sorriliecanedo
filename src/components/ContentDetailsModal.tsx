import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ContentItem } from '@/stores/content'
import { cn } from '@/lib/utils'

interface ContentDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedContent: ContentItem | null
  contentList: ContentItem[]
  onNavigate: (direction: 'next' | 'prev') => void
}

export const ContentDetailsModal = ({
  open,
  onOpenChange,
  selectedContent,
  contentList,
  onNavigate,
}: ContentDetailsModalProps) => {
  if (!selectedContent) return null

  const currentIndex = contentList.findIndex(
    (item) => item.id === selectedContent.id,
  )
  const isFirst = currentIndex === 0
  const isLast = currentIndex === contentList.length - 1

  const getImageQuery = (title: string) => {
    return encodeURIComponent(
      title.toLowerCase().split(' ').slice(0, 3).join(' '),
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] flex flex-col p-0 rounded-lg',
        )}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">
            {selectedContent.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-4">
            {selectedContent.image_url && (
              <img
                src={
                  selectedContent.image_url ||
                  `https://img.usecurling.com/p/800/400?q=${getImageQuery(
                    selectedContent.title,
                  )}`
                }
                alt={selectedContent.title}
                className="w-full h-auto max-h-80 object-contain rounded-md bg-muted"
              />
            )}
            <div
              className="prose prose-sm sm:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedContent.content }}
            />
          </div>
        </ScrollArea>
        <div className="flex justify-between items-center p-4 border-t">
          <Button
            variant="outline"
            onClick={() => onNavigate('prev')}
            disabled={isFirst}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('next')}
            disabled={isLast}
          >
            Próximo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
