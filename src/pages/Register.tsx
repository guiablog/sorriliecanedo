import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useAuthStore } from '@/stores/auth'
import { whatsappMask } from '@/lib/masks'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useAppSettingsStore } from '@/stores/appSettings'
import { Skeleton } from '@/components/ui/skeleton'
import { patientService } from '@/services/patientService'
import { Seo } from '@/components/Seo'
import { Separator } from '@/components/ui/separator'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
    whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, {
      message: 'WhatsApp inválido. Use o formato (00) 00000-0000.',
    }),
    email: z.string().email({ message: 'E-mail inválido.' }),
    password: z
      .string()
      .min(6, { message: 'Senha deve ter no mínimo 6 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const { signInWithGoogle } = useAuthStore()
  const { settings, loading: settingsLoading } = useAppSettingsStore()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    const { error } = await patientService.signUpPatient(data)

    if (error) {
      toast({
        title: 'Erro no Cadastro',
        description: error.message.includes('already registered')
          ? 'Este e-mail já está em uso.'
          : 'Não foi possível criar sua conta.',
        variant: 'destructive',
      })
      setIsLoading(false)
    } else {
      toast({
        title: 'Verifique seu e-mail!',
        description:
          'Enviamos um link de confirmação para o seu e-mail. Após confirmar, você poderá fazer login.',
      })
      navigate('/login')
    }
  }

  const defaultLogo =
    'https://img.usecurling.com/i?q=sorrilie-odontologia&color=solid-black'

  return (
    <>
      <Seo
        title="Cadastro - Sorriliê Odontologia"
        description="Crie sua conta no aplicativo da Sorriliê Odontologia para agendar consultas e cuidar do seu sorriso."
        keywords="cadastro, sorriliê, odontologia, novo paciente, criar conta"
      />
      <div className="flex flex-col min-h-screen bg-neutral-light p-6 md:p-8 justify-center animate-fade-in">
        <div className="w-full max-w-md mx-auto relative">
          <Link to="/login" className="absolute top-0 left-0 z-10">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Voltar</span>
            </Button>
          </Link>
          <div className="text-center mb-8">
            {settingsLoading ? (
              <Skeleton className="h-12 w-48 mx-auto mb-4" />
            ) : (
              <img
                src={settings?.logo_url || defaultLogo}
                alt="Logo Sorriliê"
                className="h-12 mx-auto mb-4"
              />
            )}
            <h1 className="text-2xl font-bold text-neutral-dark">
              Crie sua Conta
            </h1>
            <p className="text-neutral-dark/70">
              Preencha seus dados para começar.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full mb-4"
            size="lg"
            onClick={signInWithGoogle}
          >
            <img
              src="https://img.usecurling.com/i?q=google"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Cadastrar com Google
          </Button>

          <div className="flex items-center my-4">
            <Separator className="flex-1" />
            <span className="px-4 text-sm text-muted-foreground">OU</span>
            <Separator className="flex-1" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
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
                    <FormLabel>Confirmar Senha</FormLabel>
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
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar com E-mail'}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-neutral-dark/70">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-semibold text-accent hover:underline ml-1"
            >
              Faça login.
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
