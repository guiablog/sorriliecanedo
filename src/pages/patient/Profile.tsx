import { useEffect } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'
import { usePatientStore } from '@/stores/patient'
import { whatsappMask } from '@/lib/masks'
import { Mail } from 'lucide-react'
import { ProfileCard } from '@/components/ProfileCard'
import { AppointmentList } from '@/components/AppointmentList'

const profileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  whatsapp: z.string().min(14, { message: 'WhatsApp inválido.' }).nullable(),
  email: z.string().email({ message: 'E-mail inválido.' }),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function Profile() {
  const navigate = useNavigate()
  const { name, logout } = useAuthStore()
  const { patients, updatePatient } = usePatientStore()

  const currentUser = patients.find((p) => p.name === name)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      email: '',
    },
  })

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name,
        whatsapp: currentUser.whatsapp,
        email: currentUser.email,
      })
    }
  }, [currentUser, form])

  async function onSubmit(data: ProfileFormValues) {
    if (!currentUser || !currentUser.user_id) return
    try {
      await updatePatient(currentUser.user_id, data)
      toast({ title: 'Alterações salvas com sucesso!' })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-dark">
          Olá, {currentUser?.name?.split(' ')[0]}!
        </h1>
        <p className="text-neutral-dark/70">
          Gerencie suas informações e agendamentos.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
          <TabsTrigger value="appointments">Consultas</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados de Cadastro</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
                          <Input
                            {...field}
                            value={field.value || ''}
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
                          <Input type="email" {...field} disabled />
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments" className="mt-4">
          <AppointmentList />
        </TabsContent>
      </Tabs>

      <ProfileCard
        icon={<Mail className="h-6 w-6 text-secondary" />}
        title="Fale Conosco"
        subtitle="Envie suas dúvidas ou sugestões"
        onClick={() => navigate('/contact')}
      />

      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        Sair
      </Button>
    </div>
  )
}
