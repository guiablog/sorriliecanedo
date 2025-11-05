import { useState, useEffect } from 'react'
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
import { toast } from '@/components/ui/use-toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAppSettingsStore } from '@/stores/appSettings'
import { Skeleton } from '@/components/ui/skeleton'
import { Seo } from '@/components/Seo'
import { Separator } from '@/components/ui/separator'

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const {
    patientLogin,
    signInWithGoogle,
    isAuthenticated,
    loading: authLoading,
    userType,
  } = useAuthStore()
  const { settings, loading: settingsLoading } = useAppSettingsStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (userType === 'patient') {
        navigate('/home', { replace: true })
      } else if (userType === 'admin') {
        navigate('/admin', { replace: true })
      }
    }
  }, [isAuthenticated, authLoading, userType, navigate])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  async function handleLoginSubmit(data: LoginFormValues) {
    setIsSubmitting(true)
    const result = await patientLogin(data.email, data.password)
    if (result !== true) {
      toast({
        title: 'Falha no Login',
        description: result as string,
        variant: 'destructive',
      })
    }
    setIsSubmitting(false)
  }

  const defaultLogo =
    'https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black'

  if (authLoading || settingsLoading) {
    return <Skeleton className="h-screen w-screen" />
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <>
      <Seo
        title="Login - Sorriliê Odontologia"
        description="Acesse sua conta no aplicativo da Sorriliê Odontologia para agendar consultas e ver seu histórico."
        keywords="login, sorriliê, odontologia, agendamento, paciente"
      />
      <div className="flex flex-col min-h-screen bg-neutral-light p-6 md:p-8 justify-center items-center animate-fade-in">
        <div className="w-full max-w-sm text-center">
          <img
            src={settings?.logo_url || defaultLogo}
            alt="Logo Sorriliê"
            className="h-12 mx-auto mb-10"
          />

          <h1 className="text-xl font-medium text-neutral-dark mb-6">
            Faça login e aproveite o App da Clínica Sorriliê
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLoginSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
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
                        className="absolute inset-y-0 right-0"
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
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Entrar
              </Button>
            </form>
          </Form>

          <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <span className="px-4 text-sm text-muted-foreground">OU</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={signInWithGoogle}
          >
            <img
              src="https://hzxduikaxizacyrdbkvx.supabase.co/storage/v1/object/public/imagens/icon-google-login.svg"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Entrar com Google
          </Button>

          <p className="mt-6 text-center text-sm text-neutral-dark/70">
            Novo usuário?{' '}
            <Link
              to="/register"
              className="font-semibold text-accent hover:underline"
            >
              Criar conta
            </Link>
          </p>
          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
