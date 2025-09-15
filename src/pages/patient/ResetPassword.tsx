import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import { usePatientStore } from '@/stores/patient'
import { ArrowLeft } from 'lucide-react'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function PatientResetPassword() {
  const navigate = useNavigate()
  const {
    emailForPasswordReset,
    setEmailForPasswordReset,
    patients,
    updatePatient,
  } = usePatientStore()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (!emailForPasswordReset) {
      toast({
        title: 'Link Inválido',
        description: 'O link de redefinição de senha é inválido ou expirou.',
        variant: 'destructive',
      })
      navigate('/login')
    }
  }, [emailForPasswordReset, navigate])

  function onSubmit(data: ResetPasswordFormValues) {
    if (!emailForPasswordReset) return

    const patientToUpdate = patients.find(
      (p) => p.email === emailForPasswordReset,
    )

    if (patientToUpdate) {
      updatePatient(patientToUpdate.cpf, { password: data.password })
      toast({
        title: 'Senha Redefinida',
        description:
          'Sua senha foi alterada com sucesso. Você já pode fazer login.',
      })
      setEmailForPasswordReset(null)
      navigate('/login')
    } else {
      toast({
        title: 'Erro',
        description:
          'Não foi possível encontrar o usuário para atualizar a senha.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-light">
      <Card className="mx-auto max-w-sm w-full relative">
        <Link to="/login" className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <CardHeader className="text-center">
          <img
            src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black"
            alt="Logo Sorriliê"
            className="h-12 mx-auto mb-4"
          />
          <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
          <CardDescription>Crie uma nova senha para sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Salvar Nova Senha
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="underline">
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
