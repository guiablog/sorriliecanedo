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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Professional } from '@/stores/professional'
import { storageService } from '@/services/storageService'
import { toast } from '@/components/ui/use-toast'
import { Loader2, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const professionalSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório.' }),
  specialty: z.string().min(3, { message: 'Especialidade é obrigatória.' }),
  cro: z.string().min(3, { message: 'CRO é obrigatório.' }),
  status: z.enum(['Ativo', 'Inativo']),
  photo_url: z.string().url().optional().nullable(),
})

type ProfessionalFormValues = z.infer<typeof professionalSchema>

interface ProfessionalFormProps {
  professional?: Professional | null
  onSubmit: (data: ProfessionalFormValues) => void
  onCancel: () => void
}

export const ProfessionalForm = ({
  professional,
  onSubmit,
  onCancel,
}: ProfessionalFormProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    professional?.photo_url || null,
  )

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: professional?.name || '',
      specialty: professional?.specialty || '',
      cro: professional?.cro || '',
      status: professional?.status || 'Ativo',
      photo_url: professional?.photo_url || null,
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
      form.setValue('photo_url', publicUrl)
      setImagePreview(publicUrl)
      toast({ title: 'Foto enviada com sucesso!' })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro no Upload',
        description: 'Não foi possível enviar a foto.',
        variant: 'destructive',
      })
      setImagePreview(professional?.photo_url || null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={imagePreview || undefined} />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="max-w-xs"
            />
          </FormControl>
          {isUploading && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </div>
          )}
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Dr. João da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialidade</FormLabel>
              <FormControl>
                <Input placeholder="Ortodontista" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CRO</FormLabel>
              <FormControl>
                <Input placeholder="SP-12345" {...field} />
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
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
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
