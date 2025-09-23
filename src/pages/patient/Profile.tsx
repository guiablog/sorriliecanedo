import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/auth'
import { usePatientStore } from '@/stores/patient'
import { useAppointmentStore } from '@/stores/appointment'
import { isValidCPF } from '@/lib/utils'
import { whatsappMask, cpfMask } from '@/lib/masks'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ReviewDrawer } from '@/components/ReviewDrawer'
import { Skeleton } from '@/components/ui/skeleton'

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
  const { name, logout } = useAuthStore()
  const { patients, updatePatient } = usePatientStore()
  const { appointments, loading: appointmentsLoading } = useAppointmentStore()
  const [isDetailsVisible, setIsDetailsVisible] = useState(false)
  const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false)
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] =
    useState<any>(null)

  const currentUser = patients.find((p) => p.name === name)
  const userAppointments = appointments.filter((a) => a.patient === name)

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

  async function onSubmit(data: ProfileFormValues) {
    if (!currentUser) return
    try {
      await updatePatient(currentUser.cpf, data)
      toast({ title: 'Alterações salvas com sucesso!' })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      })
    }
  }

  const handleOpenReview = (appointment: any) => {
    setSelectedAppointmentForReview(appointment)
    setReviewDrawerOpen(true)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="p-4 space-y-8 animate-fade-in-up">
      <Collapsible open={isDetailsVisible} onOpenChange={setIsDetailsVisible}>
        <CollapsibleTrigger className="flex justify-between items-center w-full text-xl font-semibold text-neutral-dark">
          Dados de Cadastro
          <ChevronDown
            className={cn('h-5 w-5 transition-transform', {
              'rotate-180': isDetailsVisible,
            })}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
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
                        onChange={(e) =>
                          field.onChange(cpfMask(e.target.value))
                        }
                        disabled
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
        </CollapsibleContent>
      </Collapsible>

      <section>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Histórico de Consultas
        </h2>
        {appointmentsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {userAppointments.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger>
                  {format(new Date(`${item.date}T00:00:00`), 'dd/MM/yyyy')} -{' '}
                  {item.service}
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
        )}
      </section>

      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        Sair
      </Button>

      <ReviewDrawer
        appointment={selectedAppointmentForReview}
        open={isReviewDrawerOpen}
        onOpenChange={setReviewDrawerOpen}
      />
    </div>
  )
}
