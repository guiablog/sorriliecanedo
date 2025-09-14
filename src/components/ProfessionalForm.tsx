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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Professional } from '@/stores/professional'

const professionalSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório.' }),
  specialty: z.string().min(3, { message: 'Especialidade é obrigatória.' }),
  cro: z.string().min(3, { message: 'CRO é obrigatório.' }),
  status: z.enum(['Ativo', 'Inativo']),
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
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: professional?.name || '',
      specialty: professional?.specialty || '',
      cro: professional?.cro || '',
      status: professional?.status || 'Ativo',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          >
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  )
}
