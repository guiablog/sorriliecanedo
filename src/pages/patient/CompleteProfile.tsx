import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { useAuthStore } from '@/stores/auth'
import { usePatientStore } from '@/stores/patient'
import { whatsappMask } from '@/lib/masks'
import { Seo } from '@/components/Seo'
import { Loader2 } from 'lucide-react'
import { useAppSettingsStore } from '@/stores/appSettings'
import { Skeleton } from '@/components/ui/skeleton'

const completeProfileSchema = z.object({
  whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, {
    message: 'WhatsApp inválido. Use o formato (00) 00000-0000.',
  }),
})

type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>

export default function CompleteProfile() {
  const navigate = useNavigate()
  const { userId } = useAuthStore()
  const { patients, updatePatient } = usePatientStore()
  const { settings, loading: settingsLoading } = useAppSettingsStore()
  const [isLoading, setIsLoading] = useState(false)

  const currentUser = patients.find((p) => p.user_id === userId)

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      whatsapp: '',
    },
  })

  useEffect(() => {
    if (currentUser?.whatsapp) {
      navigate('/home')
    }
  }, [currentUser, navigate])

  async function onSubmit(data: CompleteProfileFormValues) {
    if (!userId) {
      toast({
        title: 'Erro',
        description: 'Usuário não encontrado. Por favor, faça login novamente.',
        variant: 'destructive',
      })
      return
    }
    setIsLoading(true)
    try {
      await updatePatient(userId, { whatsapp: data.whatsapp })
      toast({
        title: 'Cadastro Completo!',
        description: 'Seu número de WhatsApp foi salvo com sucesso.',
      })
      navigate('/home')
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar seu número. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const defaultLogo =
    'https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black'

  return (
    <>
      <Seo
        title="Complete seu Cadastro - Sorriliê Odontologia"
        description="Informe seu WhatsApp para finalizar seu cadastro e acessar o aplicativo."
      />
      <div className="flex items-center justify-center min-h-screen bg-neutral-light p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            {settingsLoading ? (
              <Skeleton className="h-12 w-48 mx-auto mb-4" />
            ) : (
              <img
                src={settings?.logo_url || defaultLogo}
                alt="Logo Sorriliê"
                className="h-12 mx-auto mb-4"
              />
            )}
            <CardTitle className="text-2xl">Complete seu Cadastro</CardTitle>
            <CardDescription>
              Por favor, informe seu número de WhatsApp para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
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
                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Salvar e Continuar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
