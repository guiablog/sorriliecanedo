import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'
import { isValidCPF } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

const loginSchema = z.object({
  credential: z
    .string()
    .min(1, 'Campo obrigatório')
    .refine(
      (val) => {
        const isEmail = z.string().email().safeParse(val).success
        const isCpf = isValidCPF(val.replace(/\D/g, ''))
        return isEmail || isCpf
      },
      { message: 'Por favor, insira um CPF ou e-mail válido.' },
    ),
  password: z.string().min(1, 'Senha é obrigatória.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { patients } = usePatientStore()
  const loginAction = useAuthStore((state) => state.login)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { credential: '', password: '' },
    mode: 'onChange',
  })

  function onSubmit(data: LoginFormValues) {
    const isEmail = z.string().email().safeParse(data.credential).success

    const patient = patients.find((p) => {
      if (isEmail) {
        return p.email === data.credential && p.password === data.password
      }
      const storedCpf = p.cpf.replace(/\D/g, '')
      const inputCpf = data.credential.replace(/\D/g, '')
      return storedCpf === inputCpf && p.password === data.password
    })

    if (patient) {
      loginAction('patient', patient.name)
      toast({ title: 'Login bem-sucedido!' })
      navigate('/home')
    } else {
      toast({
        title: 'Erro de Login',
        description: 'Credenciais inválidas. Por favor, tente novamente.',
        variant: 'destructive',
      })
      form.setError('password', { message: ' ' })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light p-6 md:p-8 justify-center items-center animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <img
          src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black"
          alt="Logo Sorriliê"
          className="h-12 mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-neutral-dark mb-2">
          Bem-vindo(a) de volta!
        </h1>
        <p className="text-neutral-dark/70 mb-6">
          Acesse sua conta para continuar.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="credential"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>CPF ou E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu CPF ou e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="font-semibold text-accent hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              size="lg"
            >
              Entrar
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-neutral-dark/70">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="font-semibold text-accent hover:underline"
          >
            Crie uma agora
          </Link>
        </p>
      </div>
    </div>
  )
}
