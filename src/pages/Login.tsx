import { useState } from 'react'
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
import { useAuthStore } from '@/stores/auth'
import { isValidCPF } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { cpfMask } from '@/lib/masks'
import { Eye, EyeOff } from 'lucide-react'
import { useAppSettingsStore } from '@/stores/appSettings'
import { Skeleton } from '@/components/ui/skeleton'
import { patientService } from '@/services/patientService'

const cpfSchema = z.object({
  cpf: z.string().refine(isValidCPF, {
    message: 'Por favor, insira um CPF válido.',
  }),
})

const passwordSchema = z.object({
  password: z.string().min(1, 'Senha é obrigatória.'),
})

type CpfFormValues = z.infer<typeof cpfSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function Login() {
  const navigate = useNavigate()
  const patientLogin = useAuthStore((state) => state.patientLogin)
  const { settings, loading: settingsLoading } = useAppSettingsStore()

  const [step, setStep] = useState<'cpf' | 'password'>('cpf')
  const [currentUser, setCurrentUser] = useState<{
    name: string
    email: string
  } | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const cpfForm = useForm<CpfFormValues>({
    resolver: zodResolver(cpfSchema),
    defaultValues: { cpf: '' },
    mode: 'onChange',
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
    mode: 'onChange',
  })

  async function handleCpfSubmit(data: CpfFormValues) {
    const patient = await patientService.getPatientByCpf(data.cpf)

    if (patient && patient.status === 'Ativo') {
      setCurrentUser({ name: patient.name, email: patient.email })
      setStep('password')
    } else if (patient) {
      toast({
        title: 'Conta Inativa',
        description:
          'Sua conta não está ativa. Entre em contato com a clínica.',
        variant: 'destructive',
      })
    } else {
      navigate('/register', { state: { cpf: data.cpf } })
    }
  }

  async function handlePasswordSubmit(data: PasswordFormValues) {
    if (!currentUser) return

    const result = await patientLogin(currentUser.email, data.password)

    if (result === true) {
      navigate('/home')
    } else {
      toast({
        title: 'Falha no Login',
        description: result as string,
        variant: 'destructive',
      })
      passwordForm.setError('password', { message: ' ' })
    }
  }

  const defaultLogo =
    'https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black'

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light p-6 md:p-8 justify-center items-center animate-fade-in">
      <div className="w-full max-w-sm text-center relative">
        {settingsLoading ? (
          <Skeleton className="h-12 w-48 mx-auto mb-10" />
        ) : (
          <img
            src={settings?.logo_url || defaultLogo}
            alt="Logo Sorriliê"
            className="h-12 mx-auto mb-10"
          />
        )}

        {step === 'cpf' && (
          <>
            <h1 className="text-xl font-medium text-neutral-dark mb-6">
              Faça login e aproveita o Aplicativo da Clinica Sorriliê
            </h1>
            <Form {...cpfForm}>
              <form
                onSubmit={cpfForm.handleSubmit(handleCpfSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={cpfForm.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu CPF"
                          {...field}
                          onChange={(e) =>
                            field.onChange(cpfMask(e.target.value))
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
                  size="lg"
                >
                  Próximo
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-neutral-dark/70">
              Novo usuário?{' '}
              <Link
                to="/register"
                className="font-semibold text-accent hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </>
        )}

        {step === 'password' && currentUser && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-neutral-dark mb-2">
                Olá, {currentUser.name.split(' ')[0]}!
              </h1>
              <p className="text-neutral-dark/70">
                Digite sua senha para continuar.
              </p>
            </div>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel>Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Sua senha"
                            {...field}
                            className="pr-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-muted-foreground"
                          aria-label={
                            showPassword ? 'Esconder senha' : 'Mostrar senha'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  size="lg"
                >
                  Entrar
                </Button>
              </form>
            </Form>
            <div className="text-center mt-[2cm]">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-accent hover:underline"
              >
                Esqueci minha senha?
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
