import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { ReviewDrawer } from '@/components/ReviewDrawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuthStore } from '@/stores/auth'
import { usePatientStore } from '@/stores/patient'
import { isValidCPF } from '@/lib/utils'
import { whatsappMask, cpfMask } from '@/lib/masks'

const profileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  cpf: z.string().refine(isValidCPF, {
    message: 'Por favor, insira um CPF válido.',
  }),
  whatsapp: z.string().min(14, { message: 'WhatsApp inválido.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const mockHistory = [
  { date: '15/09/2025', service: 'Clareamento', status: 'Realizado' },
  { date: '25/10/2025', service: 'Limpeza de Rotina', status: 'Confirmado' },
  { date: '05/08/2025', service: 'Restauração', status: 'Cancelado' },
]

type Appointment = (typeof mockHistory)[0]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Realizado':
      return 'default'
    case 'Confirmado':
      return 'secondary'
    case 'Cancelado':
      return 'destructive'
    default:
      return 'outline'
  }
}

export default function Profile() {
  const navigate = useNavigate()
  const { fullName, logout } = useAuthStore()
  const { patients, updatePatient } = usePatientStore()
  const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const currentUser = patients.find((p) => p.name === fullName)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      cpf: '',
      whatsapp: '',
      email: '',
    },
  })

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name,
        cpf: currentUser.cpf,
        whatsapp: currentUser.whatsapp,
        email: currentUser.email,
      })
    }
  }, [currentUser, form])

  function onSubmit(data: ProfileFormValues) {
    if (!currentUser) return
    updatePatient(currentUser.cpf, data)
    toast({ title: 'Alterações salvas com sucesso!' })
  }

  const handleLogout = () => {
    logout()
    navigate('/onboarding')
  }

  const handleOpenReview = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setReviewDrawerOpen(true)
  }

  return (
    <div className="p-4 space-y-8 animate-fade-in-up">
      <section>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Dados Pessoais
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                      {...field}
                      onChange={(e) => field.onChange(cpfMask(e.target.value))}
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
                      {...field}
                      onChange={(e) =>
                        field.onChange(whatsappMask(e.target.value))
                      }
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Salvar Alterações
            </Button>
          </form>
        </Form>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Histórico de Consultas
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {mockHistory.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                {item.date} - {item.service}
              </AccordionTrigger>
              <AccordionContent className="flex justify-between items-center">
                <Badge variant={getStatusVariant(item.status)}>
                  {item.status}
                </Badge>
                {item.status === 'Realizado' && (
                  <Button
                    variant="link"
                    className="text-accent"
                    onClick={() => handleOpenReview(item)}
                  >
                    Avaliar
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        Sair
      </Button>

      <ReviewDrawer
        appointment={selectedAppointment}
        open={isReviewDrawerOpen}
        onOpenChange={setReviewDrawerOpen}
      />
    </div>
  )
}
