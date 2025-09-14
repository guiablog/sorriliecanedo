import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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

const contentSchema = z.object({
  title: z.string().min(5, { message: 'Título é obrigatório (mín. 5).' }),
  content: z.string().min(10, { message: 'Conteúdo é obrigatório (mín. 10).' }),
  status: z.enum(['Publicado', 'Rascunho']),
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
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: contentItem?.title || '',
      content: contentItem?.content || '',
      status: contentItem?.status || 'Rascunho',
    },
  })

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
          >
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  )
}
