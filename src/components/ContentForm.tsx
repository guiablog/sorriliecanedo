import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ContentItem } from '@/stores/content'
import { storageService } from '@/services/storageService'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

const contentSchema = z.object({
  title: z.string().min(5, { message: 'Título é obrigatório (mín. 5).' }),
  content: z.string().min(10, { message: 'Conteúdo é obrigatório (mín. 10).' }),
  status: z.enum(['Publicado', 'Rascunho']),
  image_url: z.string().url().optional().nullable(),
})

export type ContentFormValues = z.infer<typeof contentSchema>

interface ContentFormProps {
  contentItem?: ContentItem | null
  onSubmit: (data: ContentFormValues) => void
  onCancel: () => void
}

export const ContentForm = ({
  contentItem,
  onSubmit,
  onCancel,
}: ContentFormProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    contentItem?.image_url || null,
  )

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: contentItem?.title || '',
      content: contentItem?.content || '',
      status: contentItem?.status || 'Rascunho',
      image_url: contentItem?.image_url || null,
    },
  })

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setImagePreview(URL.createObjectURL(file))

    try {
      const publicUrl = await storageService.uploadImage(file, 'imagens')
      form.setValue('image_url', publicUrl)
      setImagePreview(publicUrl)
      toast({ title: 'Imagem enviada com sucesso!' })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro no Upload',
        description: 'Não foi possível enviar a imagem.',
        variant: 'destructive',
      })
      setImagePreview(contentItem?.image_url || null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do conteúdo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escreva o conteúdo aqui..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Imagem de Capa</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </FormControl>
          <FormMessage />
          {isUploading && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </div>
          )}
          {imagePreview && !isUploading && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Pré-visualização"
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
          )}
        </FormItem>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Publicado">Publicado</SelectItem>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            disabled={isUploading}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  )
}
