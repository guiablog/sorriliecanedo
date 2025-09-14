import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

const profileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  whatsapp: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .pipe(
      z
        .string()
        .min(10, { message: 'WhatsApp deve ter pelo menos 10 dígitos.' })
        .max(11, { message: 'WhatsApp deve ter no máximo 11 dígitos.' }),
    ),
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
  const logout = useAuthStore((state) => state.logout)
  const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Maria da Silva',
      whatsapp: '(11) 98765-4321',
      email: 'maria.silva@email.com',
    },
  })

  function onSubmit(data: ProfileFormValues) {
    console.log(data)
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
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value="123.456.789-00" disabled />
            </div>
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

      <section>
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Configurações
        </h2>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <Label htmlFor="notifications" className="flex flex-col space-y-1">
            <span>Receber Notificações</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Lembretes de consultas, promoções e novidades.
            </span>
          </Label>
          <Switch id="notifications" defaultChecked />
        </div>
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
