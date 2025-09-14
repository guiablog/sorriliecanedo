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
import { Patient } from '@/stores/patient'
import { isValidCPF } from '@/lib/utils'
import { cpfMask, whatsappMask } from '@/lib/masks'

const patientSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().refine(isValidCPF, {
    message: 'Por favor, insira um CPF válido.',
  }),
  whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, {
    message: 'WhatsApp inválido. Use o formato (00) 00000-0000.',
  }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  status: z.enum(['Ativo', 'Inativo', 'Pendente de Verificação']),
})

export type PatientFormValues = z.infer<typeof patientSchema>

interface PatientFormProps {
  patient?: Patient | null
  onSubmit: (data: PatientFormValues) => void
  onCancel: () => void
}

export const PatientForm = ({
  patient,
  onSubmit,
  onCancel,
}: PatientFormProps) => {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient?.name || '',
      cpf: patient?.cpf || '',
      whatsapp: patient?.whatsapp || '',
      email: patient?.email || '',
      status: patient?.status || 'Ativo',
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
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do paciente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  {...field}
                  onChange={(e) => field.onChange(cpfMask(e.target.value))}
                  disabled={!!patient}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <Input
                  placeholder="(00) 00000-0000"
                  {...field}
                  onChange={(e) => field.onChange(whatsappMask(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="paciente@email.com"
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
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Pendente de Verificação">
                    Pendente
                  </SelectItem>
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
