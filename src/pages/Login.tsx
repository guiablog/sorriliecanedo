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
import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'
import { isValidCPF } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { cpfMask } from '@/lib/masks'

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
  const { patients } = usePatientStore()
  const loginAction = useAuthStore((state) => state.login)

  const [step, setStep] = useState<'cpf' | 'password'>('cpf')
  const [currentUser, setCurrentUser] = useState<{
    name: string
    cpf: string
  } | null>(null)

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

  function handleCpfSubmit(data: CpfFormValues) {
    const patient = patients.find((p) => {
      const storedCpf = p.cpf.replace(/\D/g, '')
      const inputCpf = data.cpf.replace(/\D/g, '')
      return storedCpf === inputCpf
    })

    if (patient && patient.status === 'Ativo') {
      setCurrentUser({ name: patient.name, cpf: patient.cpf })
      setStep('password')
    } else {
      navigate('/register', { state: { cpf: data.cpf } })
    }
  }

  function handlePasswordSubmit(data: PasswordFormValues) {
    if (!currentUser) return

    const patient = patients.find((p) => p.cpf === currentUser.cpf)

    if (patient && patient.password === data.password) {
      loginAction('patient', patient.name)
      toast({ title: 'Login bem-sucedido!' })
      navigate('/home')
    } else {
      toast({
        title: 'Senha Incorreta',
        description: 'A senha informada está incorreta. Tente novamente.',
        variant: 'destructive',
      })
      passwordForm.setError('password', { message: ' ' })
    }
  }

  const resetFlow = () => {
    setStep('cpf')
    setCurrentUser(null)
    cpfForm.reset()
    passwordForm.reset()
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light p-6 md:p-8 justify-center items-center animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <img
          src="https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black"
          alt="Logo Sorriliê"
          className="h-12 mx-auto mb-6"
        />

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
            <h1 className="text-2xl font-bold text-neutral-dark mb-2">
              Olá, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-neutral-dark/70 mb-6">
              Digite sua senha para continuar.
            </p>
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
                      <div className="flex justify-between items-center">
                        <FormLabel>Senha</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-sm font-semibold text-accent hover:underline"
                        >
                          Esqueci minha senha?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Sua senha"
                          {...field}
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
                  Entrar
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-neutral-dark/70">
              <button
                onClick={resetFlow}
                className="font-semibold text-accent hover:underline"
              >
                Não é você? Voltar
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
